import { OfficeScene } from './scene/OfficeScene'
import { TopBar } from './ui/TopBar'
import { RightPanel } from './ui/RightPanel'
import { BottomStatus } from './ui/BottomStatus'
import { ExpandedCard } from './ui/ExpandedCard'
import { useTick } from './hooks/useTick'

export default function App() {
  useTick() // drive auto-drift of dummy data

  return (
    <div className="relative h-full w-full">
      {/* 3D layer */}
      <OfficeScene />

      {/* DOM overlay */}
      <div className="pointer-events-none absolute inset-0">
        <TopBar />
        <RightPanel />
        <ExpandedCard />
        <BottomStatus />
      </div>
    </div>
  )
}
