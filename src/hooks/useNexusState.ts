import { useCallback, useEffect, useState } from 'react'
import type { Agent, AgentStatus, NexusState, Zone } from '../types'

const POLL_INTERVAL = 5000
const API_URL = 'http://198.199.87.20:8000/state'

const INITIAL_STATE: NexusState = {
  jarvis: {
    active: false,
    directingZone: null,
    lastCommand: '',
    voiceEnabled: true,
  },
  zones: [],
  globalTicker: [],
  metrics: {
    activeAgents: 0,
    totalAgents: 0,
    systemsOnline: false,
  },
}

interface ApiAgent {
  id?: string
  name?: string
  role?: string
  status?: AgentStatus
  state?: string
  activity?: string
  metric?: string
  progress?: number
}

interface ApiZone {
  id?: string
  name?: string
  sector?: string
  accent?: string
  accentDim?: string
  glow?: string
  agents?: ApiAgent[]
  statusLabel?: string
  statusValue?: string
  statusDetail?: string
  statusTicker?: string
}

interface ApiState {
  zones?: ApiZone[]
  jarvis?: Partial<NexusState['jarvis']>
  globalTicker?: string[]
  metrics?: Partial<NexusState['metrics']>
}

function isApiZoneArray(value: unknown): value is ApiZone[] {
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

function toAgentStatus(agent: ApiAgent): AgentStatus {
  if (agent.status) return agent.status
  if (agent.state === 'active') return 'working'
  if (agent.state === 'error' || agent.state === 'alert') return 'alert'
  if (agent.state === 'offline') return 'offline'
  return 'idle'
}

function normalizeAgent(agent: ApiAgent, fallback?: Agent): Agent {
  return {
    id: agent.id ?? fallback?.id ?? agent.name?.toLowerCase().replace(/\s+/g, '-') ?? 'agent',
    name: agent.name ?? fallback?.name ?? 'Agent',
    role: agent.role ?? fallback?.role ?? agent.name ?? 'AGENT',
    status: toAgentStatus(agent),
    activity: agent.activity ?? agent.metric ?? fallback?.activity ?? 'Standing by',
    progress: agent.progress ?? fallback?.progress ?? 0,
  }
}

function mergeZone(existing: Zone | undefined, incoming: ApiZone): Zone | null {
  if (!existing && !incoming.id) return null

  const agents = incoming.agents?.map((agent, index) => {
    const fallback =
      existing?.agents.find((existingAgent) => existingAgent.id === agent.id) ??
      existing?.agents[index]
    return normalizeAgent(agent, fallback)
  })

  return {
    id: incoming.id ?? existing?.id ?? 'zone',
    name: incoming.name ?? existing?.name ?? 'ZONE',
    sector: incoming.sector ?? existing?.sector ?? 'SECTOR',
    accent: incoming.accent ?? existing?.accent ?? '#00d4ff',
    accentDim: incoming.accentDim ?? existing?.accentDim ?? incoming.accent ?? '#0066aa',
    glow: existing?.glow ?? `color-mix(in srgb, ${incoming.accent ?? '#00d4ff'} 65%, transparent)`,
    agents: agents ?? existing?.agents ?? [],
    statusLabel: incoming.statusLabel ?? existing?.statusLabel ?? 'STATUS',
    statusValue: incoming.statusValue ?? existing?.statusValue ?? 'Online',
    statusDetail: incoming.statusDetail ?? incoming.statusTicker ?? existing?.statusDetail,
  }
}

function mergeZones(previousZones: Zone[], incomingZones: ApiZone[]): Zone[] {
  const merged = previousZones.map((zone) => {
    const incoming = incomingZones.find((apiZone) => apiZone.id === zone.id)
    return incoming ? mergeZone(zone, incoming) ?? zone : zone
  })

  incomingZones.forEach((incoming) => {
    if (incoming.id && !merged.some((zone) => zone.id === incoming.id)) {
      const zone = mergeZone(undefined, incoming)
      if (zone) merged.push(zone)
    }
  })

  return merged
}

function getIncomingZones(data: unknown): ApiZone[] | null {
  if (isApiZoneArray(data)) return data
  if (
    typeof data === 'object' &&
    data !== null &&
    'zones' in data &&
    isApiZoneArray((data as ApiState).zones)
  ) {
    return (data as ApiState).zones ?? null
  }
  return null
}

function normalizeApiState(data: unknown, previous: NexusState): NexusState {
  const incomingZones = getIncomingZones(data)

  if (incomingZones) {
    const partial = typeof data === 'object' && data !== null && !Array.isArray(data)
      ? (data as ApiState)
      : {}
    const zones = mergeZones(previous.zones, incomingZones)

    return {
      ...previous,
      jarvis: {
        ...previous.jarvis,
        ...partial.jarvis,
      },
      globalTicker: partial.globalTicker ?? previous.globalTicker,
      zones,
      metrics: {
        ...previous.metrics,
        ...partial.metrics,
        activeAgents: zones.reduce(
          (count, zone) =>
            count +
            zone.agents.filter((agent) => agent.status === 'working' || agent.status === 'alert')
              .length,
          0,
        ),
        totalAgents: zones.reduce((count, zone) => count + zone.agents.length, 0),
      },
    }
  }

  return data as NexusState
}

export function useNexusState() {
  const [state, setState] = useState<NexusState>(INITIAL_STATE)
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
        // keep previous state
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