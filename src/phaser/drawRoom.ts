import Phaser from 'phaser'
import type { Agent, Zone } from '../types'
import { drawRoleAgent } from './agentSprites'

interface RoomLayout {
  floorW: number
  floorH: number
  cx: number
  cy: number
}

function hexColor(hex: string): number {
  return parseInt(hex.replace('#', ''), 16)
}

function shortenLabel(name: string): string {
  if (name.length <= 12) return name.toUpperCase()
  return name.split(' ')[0].toUpperCase()
}

function drawDenseGrid(
  g: Phaser.GameObjects.Graphics,
  layout: RoomLayout,
  accent: number,
  frame: number,
) {
  const { cx, cy, floorW, floorH } = layout
  const step = 10
  const ox = (frame * 0.4) % step
  const oy = (frame * 0.25) % step

  for (let x = cx - floorW / 2 - step; x <= cx + floorW / 2 + step; x += step) {
    const alpha = Math.abs((x + ox) % 20) < 1 ? 0.2 : 0.09
    g.lineStyle(1, accent, alpha)
    g.lineBetween(x + ox, cy - floorH / 2, x + ox, cy + floorH / 2)
  }
  for (let y = cy - floorH / 2 - step; y <= cy + floorH / 2 + step; y += step) {
    const alpha = Math.abs((y + oy) % 20) < 1 ? 0.2 : 0.09
    g.lineBetween(cx - floorW / 2, y + oy, cx + floorW / 2, y + oy)
  }
}

function drawFloorPattern(
  g: Phaser.GameObjects.Graphics,
  layout: RoomLayout,
  accent: number,
  accentDim: number,
  variant: number,
  frame: number,
) {
  const { cx, cy, floorW, floorH } = layout
  g.fillStyle(0x060a14, 1)
  g.fillRect(cx - floorW / 2, cy - floorH / 2, floorW, floorH)

  drawDenseGrid(g, layout, accent, frame)

  g.lineStyle(2, accentDim, 0.85)
  g.strokeRect(cx - floorW / 2 + 3, cy - floorH / 2 + 3, floorW - 6, floorH - 6)

  if (variant === 0) {
    for (let i = 5; i >= 1; i--) {
      const r = 14 + i * 11
      g.lineStyle(i === 1 ? 2 : 1, accent, 0.18 + i * 0.1)
      g.strokeCircle(cx, cy + 6, r + Math.sin(frame * 0.04 + i) * 1.5)
    }
    g.fillStyle(accent, 0.18)
    g.fillCircle(cx, cy + 6, 18)
    g.fillStyle(accent, 0.45)
    g.fillCircle(cx, cy + 6, 7)
  } else if (variant === 1) {
    g.fillStyle(accent, 0.22)
    g.fillRect(cx - 22, cy + 2, 44, 6)
    g.fillStyle(accent, 0.1)
    g.fillRect(cx - 34, cy - 8, 68, 4)
  } else if (variant === 2) {
    const hexR = 10
    for (let row = -3; row <= 3; row++) {
      for (let col = -4; col <= 4; col++) {
        const hx = col * hexR * 1.75 + (row % 2) * hexR * 0.85 + (frame * 0.2) % 8
        const oy = row * hexR * 1.5
        if (Math.hypot(hx, oy - 6) < 58) {
          g.lineStyle(1, accent, 0.16)
          drawHex(g, cx + hx, cy + oy, hexR * 0.85)
        }
      }
    }
  } else {
    for (let a = 0; a < 12; a++) {
      const angle = (a / 12) * Math.PI * 2 + frame * 0.01
      g.lineStyle(1, accent, 0.18)
      g.lineBetween(cx, cy + 6, cx + Math.cos(angle) * 48, cy + 6 + Math.sin(angle) * 30)
    }
    g.fillStyle(accent, 0.3)
    g.fillCircle(cx, cy + 6, 12)
  }
}

function drawHex(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number) {
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6
    pts.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r })
  }
  g.strokePoints(pts, true)
}

function drawSideWalls(
  g: Phaser.GameObjects.Graphics,
  layout: RoomLayout,
  accentDim: number,
) {
  const { cx, cy, floorW, floorH } = layout
  const left = cx - floorW / 2 + 4
  const top = cy - floorH / 2 + 28
  g.fillStyle(0x080c14, 0.92)
  g.fillTriangle(left, top, left, cy + floorH / 2 - 6, left + 16, cy + floorH / 2 - 16)
  g.fillTriangle(
    cx + floorW / 2 - 4,
    top,
    cx + floorW / 2 - 4,
    cy + floorH / 2 - 6,
    cx + floorW / 2 - 20,
    cy + floorH / 2 - 16,
  )
  g.lineStyle(1, accentDim, 0.45)
  g.strokeTriangle(left, top, left, cy + floorH / 2 - 6, left + 16, cy + floorH / 2 - 16)
  g.strokeTriangle(
    cx + floorW / 2 - 4,
    top,
    cx + floorW / 2 - 4,
    cy + floorH / 2 - 6,
    cx + floorW / 2 - 20,
    cy + floorH / 2 - 16,
  )
}

function drawBackWall(
  g: Phaser.GameObjects.Graphics,
  layout: RoomLayout,
  accent: number,
  accentDim: number,
) {
  const { cx, cy, floorW, floorH } = layout
  const wallY = cy - floorH / 2 + 6
  g.fillStyle(0x101828, 1)
  g.fillRect(cx - floorW / 2 + 4, wallY, floorW - 8, 22)
  g.lineStyle(1, accentDim, 0.65)
  g.strokeRect(cx - floorW / 2 + 4, wallY, floorW - 8, 22)

  const consoles = 4
  const gap = (floorW - 28) / consoles
  for (let i = 0; i < consoles; i++) {
    const sx = cx - floorW / 2 + 14 + i * gap
    g.fillStyle(0x060a10, 1)
    g.fillRect(sx, wallY + 4, gap - 8, 14)
    g.fillStyle(accent, 0.45 + (i % 3) * 0.12)
    g.fillRect(sx + 2, wallY + 6, gap - 12, 3)
    g.fillStyle(accent, 0.2)
    g.fillRect(sx + 2, wallY + 11, gap - 12, 5)
  }
}

function drawSideConsoles(
  g: Phaser.GameObjects.Graphics,
  accent: number,
  positions: { x: number; y: number }[],
  frame: number,
) {
  positions.forEach((p, i) => {
    g.fillStyle(0x0a0e18, 1)
    g.fillRect(p.x - 16, p.y - 12, 32, 24)
    g.lineStyle(1, accent, 0.55)
    g.strokeRect(p.x - 16, p.y - 12, 32, 24)
    g.fillStyle(accent, 0.35 + (i % 2) * 0.15)
    g.fillRect(p.x - 12, p.y - 8, 24, 5)
    const blink = (frame + i * 7) % 24 < 12
    if (blink) {
      g.fillStyle(accent, 0.25)
      g.fillRect(p.x - 10, p.y, 18, 2)
      g.fillRect(p.x - 8, p.y + 4, 14, 2)
    }
  })
}

function drawDataStreams(
  g: Phaser.GameObjects.Graphics,
  layout: RoomLayout,
  accent: number,
  frame: number,
) {
  const { cx, cy, floorW, floorH } = layout
  const streams = 10
  for (let i = 0; i < streams; i++) {
    const t = ((frame * 1.4 + i * 14) % 100) / 100
    const x = cx - floorW * 0.42 + (i / (streams - 1)) * floorW * 0.84
    const y0 = cy + floorH * 0.38
    const y1 = cy - floorH * 0.38 + (1 - t) * floorH * 0.76
    g.lineStyle(1, accent, 0.12 + t * 0.35)
    g.lineBetween(x, y0, x + Math.sin(frame * 0.06 + i) * 6, y1)
    g.fillStyle(accent, 0.4 + t * 0.5)
    g.fillCircle(x + Math.sin(frame * 0.06 + i) * 6, y1, 2.5)
  }

  for (let lane = 0; lane < 5; lane++) {
    const ty = cy - floorH * 0.2 + lane * floorH * 0.14
    const t = ((frame * 1.1 + lane * 22) % 100) / 100
    const px = cx - floorW * 0.42 + t * floorW * 0.84
    g.fillStyle(accent, 0.65)
    g.fillRect(px, ty, 8, 2)
    g.lineStyle(1, accent, 0.2)
    g.lineBetween(px - 28, ty + 1, px, ty + 1)
  }
}

function drawAgentPackets(
  g: Phaser.GameObjects.Graphics,
  positions: { agent: Agent; x: number; y: number }[],
  layout: RoomLayout,
  accent: number,
  frame: number,
) {
  if (positions.length < 2) return
  const hub = { x: layout.cx, y: layout.cy + 6 }

  for (let i = 0; i < positions.length; i++) {
    const a = positions[i]
    const b = positions[(i + 1) % positions.length]
    const t = ((frame * 0.06 + i * 17) % 100) / 100
    const px = a.x + (b.x - a.x) * t
    const py = a.y + (b.y - a.y) * t
    g.lineStyle(1, accent, 0.12)
    g.lineBetween(a.x, a.y, b.x, b.y)
    g.fillStyle(accent, 0.85)
    g.fillCircle(px, py, 2.5)
  }

  positions.forEach((p, i) => {
    const t = ((frame * 0.05 + i * 23) % 100) / 100
    const px = hub.x + (p.x - hub.x) * t
    const py = hub.y + (p.y - hub.y) * t
    g.lineStyle(1, accent, 0.08)
    g.lineBetween(hub.x, hub.y, p.x, p.y)
    g.fillStyle(accent, 0.5)
    g.fillRect(px - 2, py - 1, 4, 2)
  })
}

function createEmitters(
  scene: Phaser.Scene,
  layout: RoomLayout,
  accent: number,
  zoneId: string,
) {
  const { cx, cy, floorW, floorH } = layout
  const dotKey = `dot-${zoneId}`
  const barKey = `bar-${zoneId}`
  const sparkKey = `spark-${zoneId}`

  const dotGfx = scene.make.graphics({ x: 0, y: 0 })
  dotGfx.fillStyle(accent, 1)
  dotGfx.fillCircle(2, 2, 2)
  dotGfx.generateTexture(dotKey, 4, 4)

  const barGfx = scene.make.graphics({ x: 0, y: 0 })
  barGfx.fillStyle(accent, 1)
  barGfx.fillRect(0, 0, 1, 6)
  barGfx.generateTexture(barKey, 1, 6)

  const sparkGfx = scene.make.graphics({ x: 0, y: 0 })
  sparkGfx.fillStyle(0xffffff, 1)
  sparkGfx.fillRect(0, 0, 2, 2)
  sparkGfx.generateTexture(sparkKey, 2, 2)

  const dust = scene.add.particles(0, 0, dotKey, {
    x: { min: cx - floorW / 2, max: cx + floorW / 2 },
    y: { min: cy - floorH / 2, max: cy + floorH / 2 },
    speed: { min: 8, max: 30 },
    angle: { min: 250, max: 290 },
    scale: { start: 1, end: 0 },
    alpha: { start: 0.65, end: 0 },
    lifespan: 2000,
    frequency: 55,
    blendMode: 'ADD',
    quantity: 1,
  })

  const rise = scene.add.particles(0, 0, barKey, {
    x: { min: cx - floorW * 0.4, max: cx + floorW * 0.4 },
    y: cy + floorH / 2,
    speedY: { min: -50, max: -20 },
    speedX: { min: -6, max: 6 },
    scale: { start: 1.2, end: 0.1 },
    alpha: { start: 0.55, end: 0 },
    lifespan: 1400,
    frequency: 100,
    blendMode: 'ADD',
    quantity: 1,
  })

  const drift = scene.add.particles(0, 0, sparkKey, {
    x: { min: cx - floorW / 2, max: cx + floorW / 2 },
    y: { min: cy - floorH / 2, max: cy + floorH / 2 },
    speed: { min: 12, max: 36 },
    angle: { min: 0, max: 360 },
    scale: { start: 0.6, end: 0 },
    alpha: { start: 0.7, end: 0 },
    lifespan: 900,
    frequency: 70,
    blendMode: 'ADD',
    quantity: 1,
  })

  const fall = scene.add.particles(0, 0, dotKey, {
    x: { min: cx - floorW / 2, max: cx + floorW / 2 },
    y: cy - floorH / 2,
    speedY: { min: 15, max: 35 },
    speedX: { min: -8, max: 8 },
    scale: { start: 0.5, end: 0 },
    alpha: { start: 0.4, end: 0 },
    lifespan: 1200,
    frequency: 120,
    blendMode: 'ADD',
    quantity: 1,
  })

  return [dust, rise, drift, fall]
}

export interface ZoneSceneData {
  zone: Zone
  variant: number
}

export class ZoneScene extends Phaser.Scene {
  private zone!: Zone
  private variant = 0
  private graphics!: Phaser.GameObjects.Graphics
  private streamGraphics!: Phaser.GameObjects.Graphics
  private agentGraphics!: Phaser.GameObjects.Graphics
  private labelTexts: Phaser.GameObjects.Text[] = []
  private frame = 0
  private emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = []
  private scanline?: Phaser.GameObjects.Graphics

  constructor(key: string) {
    super({ key })
  }

  init(data: ZoneSceneData) {
    this.zone = data.zone
    this.variant = data.variant
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    const layout: RoomLayout = {
      cx: w / 2,
      cy: h / 2 + 6,
      floorW: w - 10,
      floorH: h - 14,
    }

    const accent = hexColor(this.zone.accent)
    const accentHex = this.zone.accent

    const bg = this.add.graphics()
    bg.fillGradientStyle(0x040810, 0x040810, 0x0a1220, 0x100818, 1)
    bg.fillRect(0, 0, w, h)

    this.graphics = this.add.graphics()
    this.streamGraphics = this.add.graphics()
    this.agentGraphics = this.add.graphics()

    this.labelTexts = this.zone.agents.map((agent) =>
      this.add
        .text(0, 0, shortenLabel(agent.name), {
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '9px',
          color: accentHex,
          align: 'center',
        })
        .setOrigin(0.5, 0)
        .setDepth(25)
        .setAlpha(0.92),
    )

    this.emitters = createEmitters(this, layout, accent, this.zone.id)

    this.scanline = this.add.graphics()
    this.scanline.setDepth(30)

    this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => this.tick(layout, accent),
    })
  }

  private getAgentPositions(layout: RoomLayout) {
    const { cx, cy, floorW, floorH } = layout
    const agents = this.zone.agents
    const n = agents.length
    const slots =
      n === 3
        ? [
            { x: cx - floorW * 0.28, y: cy + floorH * 0.2 },
            { x: cx, y: cy + floorH * 0.26 },
            { x: cx + floorW * 0.28, y: cy + floorH * 0.2 },
          ]
        : [
            { x: cx - floorW * 0.34, y: cy + floorH * 0.18 },
            { x: cx - floorW * 0.11, y: cy + floorH * 0.26 },
            { x: cx + floorW * 0.11, y: cy + floorH * 0.26 },
            { x: cx + floorW * 0.34, y: cy + floorH * 0.18 },
          ]
    return agents.map((agent, i) => ({
      agent,
      ...(slots[i] ?? {
        x: cx,
        y: cy + floorH * 0.22,
      }),
    }))
  }

  private tick(layout: RoomLayout, accent: number) {
    this.frame++
    const accentDim = hexColor(this.zone.accentDim)

    this.graphics.clear()
    drawFloorPattern(this.graphics, layout, accent, accentDim, this.variant, this.frame)
    drawBackWall(this.graphics, layout, accent, accentDim)
    drawSideWalls(this.graphics, layout, accentDim)

    const positions = this.getAgentPositions(layout)
    drawSideConsoles(
      this.graphics,
      accent,
      positions.map((p) => ({ x: p.x, y: p.y - 22 })),
      this.frame,
    )

    const hubPulse = 0.25 + Math.sin(this.frame * 0.09) * 0.18
    this.graphics.fillStyle(accent, hubPulse)
    this.graphics.fillCircle(layout.cx, layout.cy + 6, 5 + Math.sin(this.frame * 0.07) * 2)

    this.streamGraphics.clear()
    drawDataStreams(this.streamGraphics, layout, accent, this.frame)
    drawAgentPackets(this.streamGraphics, positions, layout, accent, this.frame)

    this.agentGraphics.clear()
    positions.forEach(({ agent, x, y }, i) => {
      drawRoleAgent(this.agentGraphics, x, y, accent, agent, this.frame)
      const label = this.labelTexts[i]
      if (label) {
        label.setPosition(x, y + 20)
        label.setText(shortenLabel(agent.name))
        const glow =
          agent.status === 'working' || agent.status === 'alert' ? 1 : 0.75
        label.setAlpha(glow)
      }
    })

    if (this.scanline) {
      this.scanline.clear()
      const w = this.scale.width
      const h = this.scale.height
      const flicker = 0.07 + Math.sin(this.frame * 0.4) * 0.025
      for (let y = 0; y < h; y += 2) {
        this.scanline.fillStyle(0x000000, y % 4 === 0 ? flicker + 0.03 : flicker)
        this.scanline.fillRect(0, y, w, 1)
      }
      if (this.frame % 38 === 0) {
        this.scanline.fillStyle(0xffffff, 0.07)
        this.scanline.fillRect(0, 0, w, h)
      }
    }
  }

  updateZone(zone: Zone) {
    this.zone = zone
    this.labelTexts.forEach((t, i) => {
      if (zone.agents[i]) t.setText(shortenLabel(zone.agents[i].name))
    })
  }

  shutdown() {
    this.emitters.forEach((e) => e.destroy())
    this.labelTexts.forEach((t) => t.destroy())
  }
}
