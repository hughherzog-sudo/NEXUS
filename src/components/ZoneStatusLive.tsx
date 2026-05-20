import type { Zone } from '../types'

interface ZoneStatusLiveProps {
  zone: Zone
}

export function ZoneStatusLive({ zone }: ZoneStatusLiveProps) {
  const scrollText =
    zone.statusDetail ??
    `${zone.statusLabel} stream active — awaiting telemetry`

  return (
    <footer className="zone-status-live">
      <div className="zone-status-live__row">
        <span className="zone-status-live__label">{zone.statusLabel}</span>
        <span className="zone-status-live__sep">::</span>
        <span className="zone-status-live__value">{zone.statusValue}</span>
        <span className="zone-status-live__cursor" aria-hidden>
          _
        </span>
        <span className="zone-status-live__dots" aria-hidden>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
      <div className="zone-status-live__scroll-wrap">
        <span className="zone-status-live__scroll">{scrollText}</span>
        <span className="zone-status-live__scroll" aria-hidden>
          {scrollText}
        </span>
      </div>
    </footer>
  )
}
