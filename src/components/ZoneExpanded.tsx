import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import type { Zone } from '../types'
import { AgentRow } from './AgentRow'
import { ZoneCanvas } from './ZoneCanvas'
import { ZoneScreenFX } from './ZoneScreenFX'
import { ZoneStatusLive } from './ZoneStatusLive'

interface ZoneExpandedProps {
  zone: Zone
  onClose: () => void
}

export function ZoneExpanded({ zone, onClose }: ZoneExpandedProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="zone-expanded-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="zone-expanded zone-expanded--fullscreen"
        style={
          {
            '--zone-accent': zone.accent,
            '--zone-glow': zone.glow,
          } as CSSProperties
        }
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-label={`${zone.name} — full sector view`}
      >
        <header className="zone-expanded__header">
          <div>
            <span className="zone-expanded__sector">{zone.sector}</span>
            <h2>{zone.name}</h2>
            <ZoneStatusLive zone={zone} />
          </div>
          <button type="button" className="zone-expanded__close" onClick={onClose}>
            ✕ EXIT SECTOR VIEW
          </button>
        </header>

        <div className="zone-expanded__body">
          <div className="zone-expanded__viewport">
            <ZoneCanvas zone={zone} height={420} />
            <ZoneScreenFX />
          </div>
          <div className="zone-expanded__agents">
            <h3>AGENT ROSTER — FULL DETAIL</h3>
            {zone.agents.map((agent) => (
              <AgentRow key={agent.id} agent={agent} zone={zone} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
