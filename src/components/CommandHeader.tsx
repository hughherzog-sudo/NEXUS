interface CommandHeaderProps {
  activeAgents: number
  totalAgents: number
  systemsOnline: boolean
}

export function CommandHeader({
  activeAgents,
  totalAgents,
  systemsOnline,
}: CommandHeaderProps) {
  return (
    <div className="command-header">
      <div className="command-header__brand">
        <span className="command-header__logo">◈</span>
        <h1 className="command-header__title">NEXUS</h1>
        <span className="command-header__tag">COMMAND CENTER</span>
      </div>
      <div className="command-header__metrics">
        <span className={systemsOnline ? 'metric metric--ok' : 'metric metric--warn'}>
          {systemsOnline ? '● SYSTEMS ONLINE' : '○ DEGRADED'}
        </span>
        <span className="metric metric--agents">
          AGENTS: {activeAgents}/{totalAgents} ACTIVE
        </span>
        <span className="metric metric--time">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
