import { useEffect } from 'react'
import { useTwinStore, provider } from '../store/twinStore'

// Subscribes to the provider's drift timer for the active mode and pushes new
// target readings into the store. Re-subscribes when the mode changes.
export function useTick() {
  const office = useTwinStore((s) => s.office)
  const mode = useTwinStore((s) => s.activeMode)
  const applyReadings = useTwinStore((s) => s.applyReadings)

  useEffect(() => {
    return provider.subscribe(office, mode, applyReadings)
  }, [office, mode, applyReadings])
}
