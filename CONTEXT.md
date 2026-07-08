# Context

Office Digital Twin Dashboard — a browser-based 3D IoT digital twin. A stylized
office renders as an interactive Three.js scene with floating holographic sensor
data; a DOM control panel switches **modes**, re-animating every value across the
office. Data is simulated today behind a provider seam so a live IoT/MQTT source
can drop in later. See [`README.md`](README.md) for the stack and
[`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md) for how the code is written.

This file is the glossary of ubiquitous language. When naming a domain concept in
an issue, refactor, test, or hypothesis, use the term as defined here — don't
drift to synonyms. If a concept you need isn't listed, that's a signal: either
you're inventing language the project doesn't use, or there's a real gap to
record. Architectural decisions live in `docs/adr/`.

## Glossary

**Office** — the whole modeled space; the root domain object. One `Office` holds
`rooms: Room[]`. There is a single office (`REAL_OFFICE`). Type: `data/provider.ts`.

**Room** — a bounded area of the office. Has an `id`, a `name`, floor-plane
`bounds { x, z, w, d }` (center x/z, width along x, depth along z), and its
`sensors`.

**Sensor** — a monitored point inside a room. Has an `id`, a `SensorType`, and a
`position` (`[x, y, z]` tuple, relative to room center, world units). A sensor is
rendered as a floating icosahedron marker.

**SensorType** — the kind of thing a sensor measures: `climate`, `light`, `power`,
`door`, `motion`, `network`. Determines which metrics a sensor exposes in a given
mode.

**Metric** — one reported value for a sensor under the active mode: `{ label,
value, unit, status }`. A sensor can have several metrics at once.

**MetricStatus** — a metric's health band: `normal`, `warn`, `alert`. Drives color
everywhere via `STATUS_COLOR` (`lib/colors.ts`) — 3D markers and DOM cards agree.

**Mode** (`ModeId`) — the active dashboard lens. One of `overview`, `climate`,
`energy`, `lighting`, `security`, `occupancy`, `network`, `maintenance`. Switching
mode re-computes every sensor's metrics. "Mode" always means this dashboard lens —
not the render style (that is View Mode).

**MetricSpec / ModeConfig** — the declarative recipe (in `data/modes.ts`, the
`MODES` table) for how each `SensorType` generates its metrics under a mode:
numeric specs drift within `[min, max]`; enum specs pick from `values`. Add a mode
or metric by extending this table, not by branching in the renderer.

**Readings** — `Record<sensorId, Metric[]>`: the current target metrics for every
sensor under the active mode. Held in the store; the display lerps toward these.

**DataProvider** — the data seam. Interface with `getReadings(office, mode)` and
`subscribe(office, mode, cb)` (drift timer; returns an unsubscribe fn). `v1 =
DummyProvider` (simulated). A live IoT/MQTT source implements the same interface —
scene/UI code depends on the interface, never on `DummyProvider`.

**Drift / tick** — the provider's timer that pushes fresh target `Readings` every
few seconds so values move on their own. Subscribed via `useTick`.

**View Mode** (`ViewMode`) — how the office mesh is drawn: `solid` (default) or
`wireframe`. Toggled via `toggleViewMode`. Distinct from Mode.

**Selection** — the currently focused `{ roomId, sensorId }`. Clicking a sensor
selects it (and opens its expanded card); clicking a room selects the room.

**Floating Label** — the always-on minimal holographic value over a sensor.
Expands to a full card on selection.

**Twin store** (`useTwinStore`) — the single Zustand store; source of truth for
`office`, `activeMode`, `viewMode`, `selection`, `readings`, hover.

## Shape at a glance

```
Office
 └─ rooms: Room[]            id, name, bounds {x,z,w,d}
      └─ sensors: Sensor[]   id, type (SensorType), position [x,y,z]

Readings = { [sensorId]: Metric[] }     Metric = { label, value, unit, status }
```

## Architecture in one breath

Two layers over one twin store:

1. **3D scene** (R3F canvas) — office model, sensors, floating labels, camera,
   postprocessing (`src/scene/`).
2. **DOM overlay** (Tailwind + Framer Motion) — top bar, mode panel, status/weather
   cards, absolutely positioned over the canvas (`src/ui/`).

Both read the same store. Mode switch and drift mutate `readings`; markers and
labels subscribe and lerp their displayed numbers toward the targets each frame.
