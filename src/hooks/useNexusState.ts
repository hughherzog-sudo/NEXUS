import { useCallback, useEffect, useState } from 'react'
import type { NexusState } from '../types'
import { mockState } from '../data/mockState'

export function useNexusState() {
  const [state, setState] = useState<NexusState>(mockState)
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null)
  const [jarvisInput, setJarvisInput] = useState('')

  const toggleZone = useCallback((zoneId: string) => {
    setExpandedZoneId(zoneId)
  }, [])

  const closeExpanded = useCallback(() => setExpandedZoneId(null), [])

  const submitJarvisCommand = useCallback((command: string) => {
    const trimmed = command.trim()
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      jarvis: {
        ...prev.jarvis,
        active: true,
        lastCommand: trimmed,
      },
    }))
    setJarvisInput('')
  }, [])

  // Ambient mock updates — simulates live backend ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const zones = prev.zones.map((zone) => ({
          ...zone,
          agents: zone.agents.map((agent) => {
            if (agent.status !== 'working' || agent.progress === undefined) return agent
            const bump = Math.random() > 0.6 ? 2 : 0
            const next = Math.min(100, agent.progress + bump)
            return { ...agent, progress: next }
          }),
        }))
        return {
          ...prev,
          zones,
          jarvis: {
            ...prev.jarvis,
            active: Math.sin(Date.now() / 800) > -0.2,
          },
        }
      })
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return {
    state,
    expandedZoneId,
    jarvisInput,
    setJarvisInput,
    toggleZone,
    closeExpanded,
    submitJarvisCommand,
  }
}
