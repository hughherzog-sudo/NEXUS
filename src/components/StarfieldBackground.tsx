import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  size: number
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let raf = 0
    const stars: Star[] = []
    const hexOffset = { x: 0, y: 0 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: 0.5 + Math.random() * 1.5,
      })
    }

    const draw = () => {
      frame++
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Slow hex grid
      hexOffset.x = (frame * 0.15) % 28
      hexOffset.y = (frame * 0.08) % 24
      const hexR = 22
      ctx.strokeStyle = 'rgba(0, 140, 200, 0.06)'
      ctx.lineWidth = 1
      for (let row = -1; row < h / (hexR * 1.5) + 2; row++) {
        for (let col = -1; col < w / (hexR * 1.75) + 2; col++) {
          const x = col * hexR * 1.75 + (row % 2) * hexR * 0.85 - hexOffset.x
          const y = row * hexR * 1.5 - hexOffset.y
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6
            const px = x + Math.cos(a) * hexR
            const py = y + Math.sin(a) * hexR
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
          ctx.stroke()
        }
      }

      // Star field drift
      for (const star of stars) {
        star.y += 0.08 + star.z * 0.12
        star.x += Math.sin(frame * 0.002 + star.z * 10) * 0.05
        if (star.y > h) {
          star.y = 0
          star.x = Math.random() * w
        }
        const alpha = 0.2 + star.z * 0.6
        const glow = star.size * (1 + star.z)
        ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, glow, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield-bg" aria-hidden />
}
