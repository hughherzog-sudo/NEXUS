export type AgentStatus = 'idle' | 'working' | 'alert' | 'offline'

export interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  activity: string
  progress?: number
}

export interface Zone {
  id: string
  name: string
  sector: string
  accent: string
  accentDim: string
  glow: string
  agents: Agent[]
  statusLabel: string
  statusValue: string
  statusDetail?: string
}

export interface JarvisState {
  active: boolean
  directingZone: string | null
  lastCommand: string
  voiceEnabled: boolean
}

export interface NexusState {
  jarvis: JarvisState
  zones: Zone[]
  globalTicker: string[]
  metrics: {
    activeAgents: number
    totalAgents: number
    systemsOnline: boolean
  }
}

export interface ZoneTheme {
  floor: number
  wall: number
  screen: number
  hub: number
}
