import { useEffect, useState } from 'react'
import type { Zone } from '../types'

interface JarvisLinkProps {
  directingZoneId: string | null
  zones: Zone[]
  jarvisRef: React.RefObject<HTMLElement | null>
  gridRef: React.RefObject<HTMLElement | null>
  zoneSlotRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
}

export function JarvisLink({
  directingZoneId,
  zones,
  jarvisRef,
  gridRef,
  zoneSlotRefs,
}: JarvisLinkProps) {
  const [path, setPath] = useState('')
  const [accent, setAccent] = useState('#00d4ff')

  useEffect(() => {
    const update = () => {
      if (!directingZoneId || !jarvisRef.current || !gridRef.current) {
        setPath('')
        return
      }
      const zoneEl = zoneSlotRefs.current[directingZoneId]
      if (!zoneEl) {
        setPath('')
        return
      }

      const zone = zones.find((z) => z.id === directingZoneId)
      if (zone) setAccent(zone.accent)

      const gridRect = gridRef.current.getBoundingClientRect()
      const jarvisRect = jarvisRef.current.getBoundingClientRect()
      const zoneRect = zoneEl.getBoundingClientRect()

      const x1 = jarvisRect.left + jarvisRect.width * 0.12 - gridRect.left
      const y1 = jarvisRect.bottom - gridRect.top
      const x2 = zoneRect.left + zoneRect.width / 2 - gridRect.left
      const y2 = zoneRect.top - gridRect.top
      const midY = y1 + (y2 - y1) * 0.45

      setPath(
        `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`,
      )
    }

    update()
    const ro = new ResizeObserver(update)
    if (gridRef.current) ro.observe(gridRef.current)
    window.addEventListener('resize', update)
    const interval = setInterval(update, 400)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      clearInterval(interval)
    }
  }, [directingZoneId, zones, jarvisRef, gridRef, zoneSlotRefs])

  if (!path) return null

  return (
    <svg className="jarvis-link" aria-hidden>
      <defs>
        <filter id="jarvis-link-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        className="jarvis-link__path jarvis-link__path--ghost"
        d={path}
        stroke={accent}
      />
      <path
        className="jarvis-link__path jarvis-link__path--pulse"
        d={path}
        stroke={accent}
        filter="url(#jarvis-link-glow)"
      />
    </svg>
  )
}
