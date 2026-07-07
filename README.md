# Office Digital Twin Dashboard

<img width="1346" height="659" alt="image" src="https://github.com/user-attachments/assets/a46e4e64-63f7-44a5-a0d6-55ace2b43e84" />

Browser-based 3D IoT digital-twin dashboard. A stylized office renders as an interactive Three.js scene with floating holographic sensor data; a right-side control panel switches dashboard **modes** (Overview, Climate, Energy, Lighting, Security, Occupancy, Network, Maintenance), causing every floating value across the office to smoothly re-animate.

Data is simulated by a modular provider, built so a live IoT/MQTT source can drop in later with minimal change.

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Three.js](https://threejs.org/) via [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber) and [`@react-three/drei`](https://github.com/pmndrs/drei)
- [`@react-three/postprocessing`](https://github.com/pmndrs/react-postprocessing) for bloom/glow
- [Zustand](https://github.com/pmndrs/zustand) for the twin store (office state, active mode, selection)
- [Tailwind CSS](https://tailwindcss.com/) for the UI chrome
- [Framer Motion](https://www.framer.com/motion/) for panel transitions and count-up numbers

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL in a modern desktop browser.

Other scripts:

```bash
npm run build     # tsc -b && vite build
npm run preview   # preview a production build
```

## Project Structure

```
src/
  store/twinStore.ts       Zustand store: office, activeMode, selection, readings, actions
  data/
    provider.ts             DataProvider interface (the live-IoT swap seam)
    dummyProvider.ts         Simulated data: seeds ranges per sensor/mode, drifts on a timer
    modes.ts                 MODES config: which metrics each sensor exposes per mode
    office.ts                Procedural office layout (rooms, sensor positions)
  scene/
    OfficeScene.tsx           <Canvas>, lighting, fog, postprocessing
    OfficeModel.tsx           Renders rooms from office.ts
    Room.tsx                  Wireframe walls/floor, hover + click selection
    Sensor.tsx                Glowing sensor marker
    FloatingLabel.tsx         Always-on holographic label, lerped value
    CameraRig.tsx             Orbit controls + fly-to-room + reset view
    effects/Postprocessing.tsx  Bloom, vignette, fog
  ui/
    TopBar.tsx, RightPanel.tsx, ModeButton.tsx, StatusCard.tsx,
    WeatherCard.tsx, BottomStatus.tsx, ExpandedCard.tsx
  hooks/
    useTick.ts                Drives the dummy data provider on an interval
    useLerpedValue.ts         Smooth number transitions for labels/cards
  App.tsx                    Composes the 3D canvas + DOM overlay
```

## How It Works

- **One store, two layers.** The R3F canvas (3D office, sensors, labels, camera) and the Tailwind/Framer DOM overlay (top bar, right panel, status cards) both read the same Zustand store. Mode switches and auto-tick drift mutate store values; the scene and UI subscribe and lerp toward new targets — nothing snaps instantly.
- **Mode → metric mapping.** Each mode (`modes.ts`) declares which metrics a sensor exposes. Switching modes remaps every floating label/card to a new metric set with a smooth transition.
- **Data seam.** `dummyProvider.ts` implements the `DataProvider` interface (`provider.ts`) with simulated, drifting values. A future live source (MQTT, Firebase, Azure/AWS IoT) can implement the same interface as a drop-in replacement — no component changes required.

## Interaction

- Orbit / zoom / pan the 3D scene
- Click a room or sensor to select it and open an expanded data card
- Switch modes in the right panel to re-map all floating data
- Reset-view button returns the camera to its default angle

## Roadmap

Deferred beyond v1: real MQTT/backend integration, AI assistant panel, multi-floor/exploded building view, historical charts, scripted fault events, VR/AR/WebXR.

See [`prd.md`](prd.md) for full product requirements and [`implementation.md`](implementation.md) for the detailed build plan and architecture decisions.
