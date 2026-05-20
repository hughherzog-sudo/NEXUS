interface StatusTickerProps {
  messages: string[]
}

export function StatusTicker({ messages }: StatusTickerProps) {
  const text = messages.join('  ◆  ')
  return (
    <div className="status-ticker">
      <div className="status-ticker__track">
        <span className="status-ticker__text">{text}</span>
        <span className="status-ticker__text" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  )
}
