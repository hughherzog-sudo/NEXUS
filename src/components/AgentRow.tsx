import type { CSSProperties } from 'react'
import type { Agent, Zone } from '../types'

interface AgentRowProps {
  agent: Agent
  zone: Zone
}

const STATUS_LABELS: Record<Agent['status'], string> = {
  working: 'WORKING',
  idle: 'IDLE',
  alert: 'ALERT',
  offline: 'OFFLINE',
}

export function AgentRow({ agent, zone }: AgentRowProps) {
  return (
    <div
      className={`agent-row agent-row--${agent.status}`}
      style={{ '--agent-accent': zone.accent, '--agent-glow': zone.glow } as CSSProperties}
    >
      <div className="agent-row__avatar" aria-hidden />
      <div className="agent-row__body">
        <div className="agent-row__header">
          <span className="agent-row__name">{agent.name}</span>
          <span className={`agent-row__status agent-row__status--${agent.status}`}>
            {STATUS_LABELS[agent.status]}
          </span>
        </div>
        <p className="agent-row__activity">{agent.activity}</p>
        {agent.progress !== undefined && agent.progress > 0 && (
          <div className="agent-row__bar">
            <div
              className="agent-row__bar-fill"
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
