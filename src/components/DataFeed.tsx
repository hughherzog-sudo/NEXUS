import type { CSSProperties } from 'react'

interface DataFeedProps {
  accent?: string
}

export function DataFeed({ accent = '#00ff88' }: DataFeedProps) {
  const snippets = [
    'sync::ok',
    'latency=12ms',
    'handshake=active',
    'telemetry=streaming',
    'auth::verified',
    'queue=stable',
  ]
  const text = snippets.join(' · ')

  return (
    <div className="data-feed" style={{ '--feed-accent': accent } as CSSProperties}>
      <span className="data-feed__text">{text}</span>
      <span className="data-feed__text" aria-hidden>
        {text}
      </span>
    </div>
  )
}
