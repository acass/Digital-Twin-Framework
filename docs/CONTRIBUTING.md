# Contributing

Office Digital Twin Dashboard — a browser-based 3D IoT digital-twin. This guide
covers how the code is laid out and the conventions to follow. For architecture
detail, see [`../README.md`](../README.md) and the knowledge graph in
`graphify-out/`.

## Getting started

```bash
npm install
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build  (this is the CI gate)
npm run preview    # serve the production build
```

Requires a modern desktop browser with WebGL.

## Stack

Vite + React 18 + TypeScript, Three.js via `@react-three/fiber` + `@react-three/drei`,
`@react-three/postprocessing` for bloom, Zustand for state, Tailwind for UI chrome,
Framer Motion for panel/number transitions. Do not add a new dependency for
something a few lines or an existing dep already covers.

## Project layout

Put new code in the directory that matches its role:

| Directory | What lives here |
|-----------|-----------------|
| `src/scene/` | Three.js / R3F scene objects (rooms, sensors, camera, model, effects) |
| `src/ui/` | 2D DOM chrome — panels, cards, buttons (Tailwind + Framer Motion) |
| `src/data/` | Data providers, office/room layout data, mode definitions |
| `src/store/` | Zustand store (`twinStore`) — office state, active mode, view mode, selection |
| `src/hooks/` | Reusable hooks (`useTick`, `useLerpedValue`) |
| `src/lib/` | Framework-agnostic helpers (colors, math) |

## Conventions

- **TypeScript is the gate.** There is no ESLint/Prettier config. `tsc` runs in
  `strict` mode with `noUnusedLocals`, `noUnusedParameters`, and
  `noFallthroughCasesInSwitch`. Run `npm run build` before opening a PR — unused
  vars and untyped code fail the build.
- **No emoji in source code.** (Fine in docs/UI copy where intentional.)
- **State goes through `twinStore`.** Read and mutate shared state (mode, view
  mode, selection, sensor readings) via the Zustand store, not component-local
  copies or prop-drilling across the scene/UI boundary.
- **Keep the data layer swappable.** Simulated data comes from a provider
  (`src/data/provider.ts`, `dummyProvider.ts`). A live IoT/MQTT source should be
  able to drop in behind the same interface — don't couple scene/UI code to the
  dummy provider directly.
- **Scene vs UI separation.** 3D objects live in `src/scene/`; DOM chrome in
  `src/ui/`. Don't mix R3F and DOM rendering in one component.
- **Share, don't copy.** Room/sensor layout factories and constants (e.g.
  `WALL_H`) should live in one place and be imported. Copy-pasting layout logic
  between `office.ts`-style files creates a shotgun-surgery seam.
- **Drop calibration/debug flags before merging.** Flags like `CALIBRATE` and
  `console.log` click probes are for aligning the GLB model during development —
  turn them off (or remove them) before the change ships.

## Knowledge graph

This repo has a graphify knowledge graph at `graphify-out/`.

- Answer codebase questions with `graphify query "<question>"`,
  `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` before grepping.
- After modifying code, run `graphify update .` to keep the graph current
  (AST-only, no API cost).

## Issues and workflow

Issues and PRDs live as GitHub issues via the `gh` CLI. Before filing or picking
up work, read the agent docs:

- Issue tracker: [`agents/issue-tracker.md`](agents/issue-tracker.md)
- Triage labels (`needs-triage`, `needs-info`, `ready-for-agent`,
  `ready-for-human`, `wontfix`): [`agents/triage-labels.md`](agents/triage-labels.md)
- Domain docs layout: [`agents/domain.md`](agents/domain.md)

## Pull requests

1. Branch off `main` (e.g. `feature/<short-name>`).
2. `npm run build` passes clean (this is the type-check gate).
3. Run `graphify update .` if you touched code.
4. Keep the diff scoped to one concern; reference the issue it closes.
