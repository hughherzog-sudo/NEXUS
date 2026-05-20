import { useState, type FormEvent } from 'react'
import type { JarvisState, Zone } from '../types'

interface JarvisBarProps {
  jarvis: JarvisState
  zones: Zone[]
  input: string
  onInputChange: (v: string) => void
  onSubmit: (command: string) => void
}

export function JarvisBar({
  jarvis,
  zones,
  input,
  onInputChange,
  onSubmit,
}: JarvisBarProps) {
  const [inputFocused, setInputFocused] = useState(false)
  const directing = zones.find((z) => z.id === jarvis.directingZone)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(input)
  }

  return (
    <header
      className={`jarvis ${jarvis.active ? 'jarvis--active' : ''} ${
        inputFocused ? 'jarvis--input-hot' : ''
      }`}
    >
      <div className="jarvis__aura" aria-hidden />
      <div className="jarvis__inner">
        <div className="jarvis__core">
          <div className="jarvis__orb" aria-hidden>
            <span className="jarvis__orb-ring jarvis__orb-ring--outer" />
            <span className="jarvis__orb-ring jarvis__orb-ring--mid" />
            <span className="jarvis__orb-ring jarvis__orb-ring--inner" />
            <span className="jarvis__orb-pulse" />
            <span className="jarvis__orb-core">J</span>
          </div>
          <div className="jarvis__info">
            <div className="jarvis__title-row">
              <h1 className="jarvis__title">JARVIS</h1>
              <span className="jarvis__subtitle">OMNI COMMAND LAYER</span>
              {jarvis.active && <span className="jarvis__live">● ACTIVE</span>}
            </div>
            <p className="jarvis__directive">
              {directing ? (
                <>
                  Directing{' '}
                  <span style={{ color: directing.accent }}>{directing.name}</span>
                </>
              ) : (
                'Standing by — all sectors nominal'
              )}
            </p>
            <p className="jarvis__last-cmd">
              <span className="jarvis__cmd-cursor">&gt;</span> {jarvis.lastCommand}
            </p>
          </div>
        </div>
        <form
          className={`jarvis__input-row ${inputFocused ? 'jarvis__input-row--hot' : ''}`}
          onSubmit={handleSubmit}
        >
          <span className="jarvis__prompt">&gt;&gt;</span>
          <input
            type="text"
            className="jarvis__input"
            placeholder="Issue command to all zones…"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            spellCheck={false}
          />
          <button type="submit" className="jarvis__send">
            TRANSMIT
          </button>
        </form>
      </div>
    </header>
  )
}
