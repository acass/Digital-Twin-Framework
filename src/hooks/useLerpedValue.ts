import { useEffect, useRef, useState } from 'react'

// Smoothly animate a displayed number toward a target (never snaps).
// Used by floating labels and status cards for count-up transitions.
export function useLerpedValue(target: number, speed = 6): number {
  const [display, setDisplay] = useState(target)
  const ref = useRef(target)
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const cur = ref.current
      const t = targetRef.current
      const next = cur + (t - cur) * Math.min(1, speed * dt)
      if (Math.abs(t - next) < 0.001) {
        ref.current = t
        setDisplay(t)
      } else {
        ref.current = next
        setDisplay(next)
        raf = requestAnimationFrame(tick)
        return
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, speed])

  return display
}
