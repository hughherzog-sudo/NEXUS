import { useCallback, useEffect, useState } from 'react'
import { mockState } from '../data/mockState'
import type { NexusState, Zone } from '../types'

const POLL_INTERVAL = 5000
const API_URL = 'http://198.199.87.20:8000/state'

function isZoneArray(value: unknown): value is Zone[] {
  return (
    Array.isArray(value) &&
    value.every(
      (zone) =>
        typeof zone === 'object' &&
        zone !== null &&
        'id' in zone &&
        'agents' in zone,
    )
  )
}

function normalizeApiState(data: unknown, previous: NexusState): NexusState {
  if (isZoneArray(data)) {
    return {
      ...previous,
      zones: data,
      metrics: {
        ...previous.metrics,
        activeAgents: data.reduce(
          (count, zone) =>
            count +
            zone.agents.filter((agent) => agent.status === 'working' || agent.status === 'alert')
              .length,
          0,
        ),
        totalAgents: data.reduce((count, zone) => count + zone.agents.length, 0),
      },
    }
  }

  return data as NexusState
}

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

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('Bad response')
        const data = await res.json()
        setState((prev) => normalizeApiState(data, prev))
      } catch {
        setState(mockState)
      }
    }

    fetchState()
    const interval = setInterval(fetchState, POLL_INTERVAL)
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