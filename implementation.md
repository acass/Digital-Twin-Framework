# Office Digital Twin Dashboard — Implementation Plan

## Context

Greenfield build. Project dir holds only `prd.md` and the concept image `IMG_0663.jpg` — a dark, blue-glow "command center" home dashboard with a wireframe 3D floorplan, floating sensor icons, and a right-side panel of mode/status/weather cards.

Goal: a browser 3D IoT digital-twin dashboard matching that aesthetic. A stylized office renders as an interactive 3D model with floating holographic sensor data. A right-side panel switches dashboard **modes** (Overview, Climate, Energy, Lighting, Security, Occupancy, Network, Maintenance); switching a mode smoothly re-animates every floating value across the office. Data is faked by a modular engine designed so a live IoT source can drop in later with minimal change.

## Locked Decisions

- **Office model**: procedural low-poly built from Three.js primitives now, behind a loader seam so a real GLB / floorplan can replace it later. No art pipeline blocking v1.
- **Floating cards**: hybrid — always-on minimal holographic labels over each sensor, full expandable card on room/device select.
- **Data engine**: auto-tick (values drift every few seconds) AND re-map on mode switch, all smoothly animated (no instant jumps).
- **AI assistant**: deferred. Leave a state/query seam only. No panel in v1.

## Stack

- **Vite + React 18** (TS)
- **three** + **@react-three/fiber** + **@react-three/drei** (camera controls, Html labels, Grid, Environment)
- **@react-three/postprocessing** — Bloom, depth-of-field/fog for the glow look
- **zustand** — single twin store (office state + active mode + selection)
- **tailwindcss** — right panel / top bar / bottom status chrome
- **framer-motion** — panel card transitions, count-up numbers
- Skip GSAP/React-Spring/Leva for v1 (lerp + framer cover it). Add Leva only if live-tuning the scene becomes painful.

## Architecture

Two layers over one Zustand store:
1. **3D scene** (R3F canvas) — the office, sensors, floating labels, camera, postprocessing.
2. **DOM overlay** (Tailwind/framer) — top bar, right mode panel, status cards, bottom status, weather. Positioned absolutely over the canvas, matching the concept image layout.

Both read the same store. Mode switch and auto-tick mutate store values; sensors/labels subscribe and lerp their displayed numbers toward targets each frame.

### Data model (the seam that matters)

```
Office
 └─ rooms: Room[]
      └─ id, name, bounds {x,z,w,d}, sensors: Sensor[]
            └─ id, type, position {x,y,z}

// Values keyed by mode, decoupled from geometry:
TwinState = {
  office: Office,                       // static geometry
  activeMode: ModeId,
  selection: {roomId|null, sensorId|null},
  readings: Record<sensorId, Record<ModeId, Metric[]>>  // target values
}
Metric = { label, value, unit, status }  // status ∈ normal|warn|alert → color
```

- `dataProvider` interface: `getReadings(office, mode) => Record<sensorId, Metric[]>` and `subscribe(cb)`.
- v1 impl = `DummyProvider`: seeds plausible ranges per (sensor type, mode), drifts them on a timer, emits new targets. Live IoT later = new provider implementing the same interface. **This interface is the "minimal change" success criterion from the PRD.**

### Mode → metric mapping

Each dashboard mode defines which metrics every sensor exposes (from PRD "Example Modes"). E.g. Climate → Temp/Humidity/AirQuality/CO2/AirFlow; Energy → Power/Voltage/Current/Breaker/UPS; Security → Doors/Motion/Badge/Camera. Overview → a headline metric per sensor. Stored as a static `MODES` config map, not hardcoded in components.

## Component Structure

```
src/
  store/twinStore.ts            zustand: office, activeMode, selection, readings, actions
  data/
    modes.ts                    MODES config (id, label, per-sensor metric set)
    office.ts                   procedural office layout (rooms, sensor positions)
    dummyProvider.ts            DummyProvider (drift timer + range seeds)
    provider.ts                 DataProvider interface + types
  scene/
    OfficeScene.tsx             <Canvas>, lighting, fog, postprocessing (Bloom)
    OfficeModel.tsx             renders rooms from office.ts; GLB loader seam here
    Room.tsx                    wireframe walls/floor; hover + click → selection
    Sensor.tsx                  glowing icon marker at position
    FloatingLabel.tsx           always-on drei <Html> minimal label, lerped value
    ExpandedCard.tsx            full card shown when sensor/room selected
    CameraRig.tsx               OrbitControls + fly-to-room + reset
    effects/Postprocessing.tsx  Bloom, vignette, fog
  ui/
    TopBar.tsx                  title (LOS LEIVA-style), date/time
    RightPanel.tsx              mode buttons + status cards + weather
    ModeButton.tsx
    StatusCard.tsx              framer count-up / color transitions
    BottomStatus.tsx            "HELLO, HOME!" / updated timestamp
  hooks/
    useTick.ts                  drives DummyProvider on interval
    useLerpedValue.ts           smooth number transitions for labels/cards
  App.tsx                       Canvas + overlay compose
  main.tsx
```

## Visual target (from IMG_0663.jpg)

- Near-black bg (`#05080f`-ish), cyan/blue wireframe office, subtle grid floor (drei `<Grid>`).
- Bloom on emissive sensor icons + labels for the holographic glow.
- Right panel: rounded dark cards, thin cyan borders, big temperature/status numerals, weather card at bottom.
- Slight camera drift / isometric default angle; particles optional (add only if it still looks flat).

## Build Sequence

1. **Scaffold**: `npm create vite@latest . -- --template react-ts`, add deps, Tailwind config, base dark theme. Empty canvas + overlay shells render.
2. **Store + data seam**: `provider.ts`, `modes.ts`, `office.ts` (3-6 rooms, a few sensors each), `dummyProvider.ts`, `twinStore.ts`. No UI yet — verify provider emits sane metrics per mode.
3. **3D office**: `OfficeScene` + `OfficeModel` + `Room` wireframes + grid + lighting + Bloom. Orbit/zoom/pan works. Matches the wireframe look.
4. **Sensors + floating labels**: `Sensor` markers, always-on `FloatingLabel` reading store. Values visibly present in scene.
5. **Right panel + modes**: `RightPanel` mode buttons dispatch `setMode`; labels re-map and lerp to new metrics. Status/weather cards.
6. **Selection + expanded card + camera fly-to**: click room/sensor → highlight + `ExpandedCard` + camera eases in. Reset-view button.
7. **Auto-tick + smooth counts**: `useTick` drifts values on interval; `useLerpedValue` / framer count-up so numbers animate, never snap.
8. **Polish**: bloom/fog tuning, top bar clock, bottom status, responsive-ish layout, 60fps check.

## Files created (all new — greenfield)

Everything under `src/` above, plus `index.html`, `tailwind.config.js`, `vite.config.ts`, `package.json`. Reuse discipline is internal — `MODES`/provider config drive components, geometry never hardcodes values.

## Verification

- `npm run dev` → office renders, orbit/zoom/pan smooth.
- Click each mode button → every floating label + right-panel card animates to new metric set, no instant jumps.
- Values drift on their own every few seconds while idle.
- Click a room/sensor → highlight + expanded card + camera fly-to; reset button restores view.
- DevTools perf: ~60fps on a modern desktop browser (PRD success criterion).
- Swap-test the seam: temporarily point store at a stub provider returning fixed values → UI updates with zero component changes, proving the live-IoT path.

## Out of scope for v1 (future hooks)

Real MQTT/backend, AI assistant panel, multi-floor/exploded building, historical charts, scripted fault events, VR/AR/WebXR. Store + provider interface leave room for all; none built now.
