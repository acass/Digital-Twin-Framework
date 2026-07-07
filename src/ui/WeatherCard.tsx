// Static weather card (matches concept image). Future: wire to a weather API.
export function WeatherCard() {
  return (
    <div className="rounded-lg border border-cyan-dim/30 bg-panel px-4 py-3">
      <div className="text-xs text-cyan-glow/70">Asheville, NC</div>
      <div className="text-xs text-cyan-glow/50">Partly Cloudy, feels like 59°</div>
      <div className="mt-1 flex items-end justify-between">
        <span className="text-4xl font-light text-white">59°</span>
        <div className="text-right text-[10px] text-cyan-glow/50">
          <div>precipitation 0%</div>
          <div>humidity 67%</div>
        </div>
      </div>
    </div>
  )
}
