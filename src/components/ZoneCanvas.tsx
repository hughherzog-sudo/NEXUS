import { useEffect, useRef } from 'react'
import type Phaser from 'phaser'
import type { Zone } from '../types'
import { createZoneGame, updateZoneGame } from '../phaser/createZoneGame'

interface ZoneCanvasProps {
  zone: Zone
  /** Fixed height for expanded view; grid panels use flex parent height */
  height?: number
}

export function ZoneCanvas({ zone, height }: ZoneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const boot = () => {
      const width = el.clientWidth || 300
      const h = height ?? (el.clientHeight || 128)
      if (width < 10 || h < 10) return
      gameRef.current?.destroy(true)
      gameRef.current = createZoneGame(el, zone, width, h)
    }

    boot()
    const ro = new ResizeObserver(() => boot())
    ro.observe(el)

    return () => {
      ro.disconnect()
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recreate on zone id / fixed height
  }, [zone.id, height])

  useEffect(() => {
    if (gameRef.current) updateZoneGame(gameRef.current, zone)
  }, [zone])

  return (
    <div
      className="zone-canvas"
      ref={containerRef}
      style={height !== undefined ? { height } : undefined}
    />
  )
}
