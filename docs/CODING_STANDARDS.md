# Coding Standards

Code-level conventions for the Office Digital Twin. For setup, project layout,
and the PR workflow see [`CONTRIBUTING.md`](CONTRIBUTING.md). These standards are
descriptive — they codify patterns already in `src/`. Match the surrounding code.

## TypeScript

- **Strict, no escapes.** `tsc` runs `strict` with `noUnusedLocals`,
  `noUnusedParameters`, `noFallthroughCasesInSwitch`. No `any`, no
  `@ts-ignore`. `npm run build` is the gate.
- **`import type` for type-only imports.** `isolatedModules` is on, so type
  imports must be marked: `import type { Office, Readings } from '../data/provider'`.
- **Handle nullable explicitly.** Optional-chain and default at the read site:
  `const status = metrics?.[0]?.status ?? 'normal'`. Don't assume readings exist
  for every sensor in every mode.
- **Intentionally-unused param?** Discard it with `void floorY` rather than
  dropping it from the signature (see `Sensor.tsx`) — keeps the prop contract
  while satisfying `noUnusedParameters`.

## Naming

- Components and their files: `PascalCase` (`SensorLayer.tsx` exports `SensorLayer`).
- Functions/variables: `camelCase`. Constants and lookup tables: `UPPER_SNAKE`
  (`STATUS_COLOR`, `MODES`, `WALL_H`, `CYAN`).
- Refs end in `Ref` (`meshRef`), ids end in `Id` (`roomId`, `sensorId`, `ModeId`).
- On import name clash, alias the type, not the value:
  `import type { Sensor as SensorT } from '../data/provider'`.
- No emoji in source. (Unit/label *strings* like `'°F'`, `'CO₂'` are data, and
  fine.)

## Types live at the data seam

`src/data/provider.ts` is the single source for domain types (`Sensor`, `Room`,
`Office`, `Metric`, `ModeId`, `Readings`, the `DataProvider` interface). Import
domain types from there — don't redeclare shapes locally. A live IoT provider
implements the same `DataProvider` interface, so keep scene/UI code depending on
the interface, never on `DummyProvider` directly.

## State (Zustand)

- **One store: `useTwinStore`.** It is the single source of truth for `office`,
  `activeMode`, `viewMode`, `selection`, `readings`, hover.
- **Select one value per hook call** — never destructure the whole store:
  ```ts
  const selectSensor = useTwinStore((s) => s.selectSensor)
  const isSelected   = useTwinStore((s) => s.selection.sensorId === sensor.id)
  ```
  This keeps re-renders scoped to what the component actually reads.
- Mutations go through named actions on the store (`setMode`, `toggleViewMode`,
  `selectRoom`, …). Don't `set` store shape from components.

## R3F / animation

- **Animate in `useFrame`, mutate refs — never `setState` per frame.** Drive
  `mesh.position` / `scale` directly:
  ```ts
  useFrame((state) => {
    if (!meshRef.current) return          // always guard the ref first
    const t = state.clock.elapsedTime
    meshRef.current.position.y = base + Math.sin(t * 1.5) * 0.08
  })
  ```
- Smooth *displayed numbers* (labels, cards) with `useLerpedValue` — values lerp
  toward targets, never snap.
- Any raw `requestAnimationFrame` loop returns its `cancelAnimationFrame` in the
  `useEffect` cleanup (see `useLerpedValue`). Clamp `dt` (`Math.min(0.05, …)`) so
  a backgrounded tab doesn't jump.
- Stop event propagation on interactive meshes: `onClick={(e) => { e.stopPropagation(); … }}`.

## Constants and colors

- Colors centralize in `src/lib/colors.ts` as hex strings (`STATUS_COLOR`,
  `CYAN`), shared by 3D materials and DOM cards so both agree. Don't inline a new
  hex where a named one exists.
- Shared geometry constants (`WALL_H`, floor-plane math) live in one module and
  are imported. Two files silently agreeing on the same magic number is a bug
  waiting to happen.

## Config as data, not branches

Per-mode/per-sensor behaviour is declared as data, not `switch` statements.
`src/data/modes.ts` builds specs with the `n()` (numeric) and `enumM()` (enum)
helpers and the provider reads them:

```ts
climate: [n('temp', 'Temperature', '°F', 66, 79, 0, 77, 82)],
door:    [enumM('door', 'Door', ['LOCKED', 'OPEN'], ['OPEN'])],
```

Add a mode/metric by extending the `MODES` table — not by adding a branch in the
renderer or provider.

## Comments

Short, intent-first, above non-obvious blocks — say *why*, not *what*:
`// Single source of truth. Swap provider for a live DataProvider later.`,
`// gentle float + pulse`. Skip narration of code that reads plainly.

## Before merging

- Turn off / remove dev-only calibration: `CALIBRATE` flags, `console.log` click
  probes, identity `GLB_TRANSFORM` placeholders once the mesh is aligned.
- `npm run build` clean, then `graphify update .` if code changed.
