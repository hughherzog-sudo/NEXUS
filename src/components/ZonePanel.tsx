import { forwardRef, type CSSProperties } from 'react'
import type { Zone } from '../types'
import { ZoneCanvas } from './ZoneCanvas'
import { ZoneScreenFX } from './ZoneScreenFX'
import { ZoneStatusLive } from './ZoneStatusLive'

interface ZonePanelProps {
  zone: Zone
  gridSlot: 1 | 2 | 3 | 4 | 5
  onSelect: () => void
  isDimmed?: boolean
  isDirected?: boolean
}

export const ZonePanel = forwardRef<HTMLElement, ZonePanelProps>(function ZonePanel(
  { zone, gridSlot, onSelect, isDimmed, isDirected },
  ref,
) {
  const workingCount = zone.agents.filter(
    (a) => a.status === 'working' || a.status === 'alert',
  ).length

  return (
    <article
      ref={ref}
      className={`zone-panel zone-panel--slot-${gridSlot} ${isDimmed ? 'zone-panel--dimmed' : ''} ${isDirected ? 'zone-panel--directed' : ''}`}
      style={
        {
          '--zone-accent': zone.accent,
          '--zone-accent-dim': zone.accentDim,
          '--zone-glow': zone.glow,
        } as CSSProperties
      }
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
      aria-label={`${zone.name} — click to expand`}
    >
      <div className="zone-panel__glow-ring" aria-hidden />
      <div className="zone-panel__bezel">
        <div className="zone-panel__rivets" aria-hidden />
        <header className="zone-panel__header">
          <span className="zone-panel__sector">{zone.sector}</span>
          <h2 className="zone-panel__name">{zone.name}</h2>
          <span className="zone-panel__agent-count">
            {workingCount}/{zone.agents.length}
          </span>
        </header>

        <div className="zone-panel__screen">
          <ZoneCanvas zone={zone} />
          <ZoneScreenFX />
        </div>

        <ZoneStatusLive zone={zone} />

        <div className="zone-panel__terminal" aria-hidden>
          <span>
            &gt; link::{zone.id}::SECURE latency=8ms buf=OK sync=LOCKED ▮▮▮
          </span>
          <span>
            &gt; link::{zone.id}::SECURE latency=8ms buf=OK sync=LOCKED ▮▮▮
          </span>
        </div>
      </div>
    </article>
  )
})
