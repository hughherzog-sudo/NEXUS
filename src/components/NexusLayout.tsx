import { useMemo, useRef } from 'react'
import { useNexusState } from '../hooks/useNexusState'
import { CommandHeader } from './CommandHeader'
import { JarvisBar } from './JarvisBar'
import { JarvisLink } from './JarvisLink'
import { ScanlineOverlay } from './ScanlineOverlay'
import { StarfieldBackground } from './StarfieldBackground'
import { StatusTicker } from './StatusTicker'
import { ZoneExpanded } from './ZoneExpanded'
import { ZonePanel } from './ZonePanel'

export function NexusLayout() {
  const {
    state,
    expandedZoneId,
    jarvisInput,
    setJarvisInput,
    toggleZone,
    closeExpanded,
    submitJarvisCommand,
  } = useNexusState()

  const jarvisRef = useRef<HTMLDivElement>(null)
  const commandAreaRef = useRef<HTMLDivElement>(null)
  const zoneRefs = useRef<Record<string, HTMLElement | null>>({})

  const activeCount = useMemo(
    () =>
      state.zones.reduce(
        (n, z) =>
          n + z.agents.filter((a) => a.status === 'working' || a.status === 'alert').length,
        0,
      ),
    [state.zones],
  )

  const totalAgents = useMemo(
    () => state.zones.reduce((n, z) => n + z.agents.length, 0),
    [state.zones],
  )

  const expandedZone = state.zones.find((z) => z.id === expandedZoneId)
  const [z1, z2, z3, z4, z5] = state.zones

  const setZoneRef = (id: string) => (el: HTMLElement | null) => {
    zoneRefs.current[id] = el
  }

  return (
    <div className="nexus-app">
      <StarfieldBackground />
      <div className="nexus-app__nebula" aria-hidden />
      <ScanlineOverlay />

      <div className={`nexus-frame ${expandedZoneId ? 'nexus-frame--expanded-open' : ''}`}>
        <div className="nexus-frame__corner nexus-frame__corner--tl" aria-hidden />
        <div className="nexus-frame__corner nexus-frame__corner--tr" aria-hidden />
        <div className="nexus-frame__corner nexus-frame__corner--bl" aria-hidden />
        <div className="nexus-frame__corner nexus-frame__corner--br" aria-hidden />

        <CommandHeader
          activeAgents={activeCount}
          totalAgents={totalAgents}
          systemsOnline={state.metrics.systemsOnline}
        />

        <div className="nexus-command-area" ref={commandAreaRef}>
          <div ref={jarvisRef}>
            <JarvisBar
              jarvis={state.jarvis}
              zones={state.zones}
              input={jarvisInput}
              onInputChange={setJarvisInput}
              onSubmit={submitJarvisCommand}
            />
          </div>

          <JarvisLink
            directingZoneId={state.jarvis.directingZone}
            zones={state.zones}
            jarvisRef={jarvisRef}
            gridRef={commandAreaRef}
            zoneSlotRefs={zoneRefs}
          />

          <div className="nexus-grid">
            {z1 && (
              <ZonePanel
                ref={setZoneRef(z1.id)}
                zone={z1}
                gridSlot={1}
                onSelect={() => toggleZone(z1.id)}
                isDimmed={!!expandedZoneId && expandedZoneId !== z1.id}
                isDirected={state.jarvis.directingZone === z1.id}
              />
            )}
            {z2 && (
              <ZonePanel
                ref={setZoneRef(z2.id)}
                zone={z2}
                gridSlot={2}
                onSelect={() => toggleZone(z2.id)}
                isDimmed={!!expandedZoneId && expandedZoneId !== z2.id}
                isDirected={state.jarvis.directingZone === z2.id}
              />
            )}
            {z3 && (
              <ZonePanel
                ref={setZoneRef(z3.id)}
                zone={z3}
                gridSlot={3}
                onSelect={() => toggleZone(z3.id)}
                isDimmed={!!expandedZoneId && expandedZoneId !== z3.id}
                isDirected={state.jarvis.directingZone === z3.id}
              />
            )}
            {z4 && (
              <ZonePanel
                ref={setZoneRef(z4.id)}
                zone={z4}
                gridSlot={4}
                onSelect={() => toggleZone(z4.id)}
                isDimmed={!!expandedZoneId && expandedZoneId !== z4.id}
                isDirected={state.jarvis.directingZone === z4.id}
              />
            )}
            {z5 && (
              <ZonePanel
                ref={setZoneRef(z5.id)}
                zone={z5}
                gridSlot={5}
                onSelect={() => toggleZone(z5.id)}
                isDimmed={!!expandedZoneId && expandedZoneId !== z5.id}
                isDirected={state.jarvis.directingZone === z5.id}
              />
            )}
          </div>
        </div>

        <StatusTicker messages={state.globalTicker} />
      </div>

      {expandedZone && <ZoneExpanded zone={expandedZone} onClose={closeExpanded} />}
    </div>
  )
}
