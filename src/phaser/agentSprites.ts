import Phaser from 'phaser'
import type { Agent } from '../types'

export type AgentRoleKind =
  | 'script'
  | 'voice'
  | 'edit'
  | 'upload'
  | 'scout'
  | 'outreach'
  | 'reception'
  | 'close'
  | 'prospect'
  | 'build'
  | 'deliver'
  | 'scan'
  | 'signal'
  | 'exec'
  | 'risk'
  | 'news'
  | 'score'
  | 'place'
  | 'default'

export function resolveAgentRole(role: string, id: string): AgentRoleKind {
  const key = `${role} ${id}`.toLowerCase()
  if (key.includes('script')) return 'script'
  if (key.includes('voice') || key.includes('vo')) return 'voice'
  if (key.includes('edit')) return 'edit'
  if (key.includes('upload')) return 'upload'
  if (key.includes('scout') || key.includes('finder')) return 'scout'
  if (key.includes('outreach')) return 'outreach'
  if (key.includes('recep')) return 'reception'
  if (key.includes('close')) return 'close'
  if (key.includes('prospect')) return 'prospect'
  if (key.includes('build')) return 'build'
  if (key.includes('deliver')) return 'deliver'
  if (key.includes('scan')) return 'scan'
  if (key.includes('signal')) return 'signal'
  if (key.includes('exec')) return 'exec'
  if (key.includes('risk')) return 'risk'
  if (key.includes('news')) return 'news'
  if (key.includes('score')) return 'score'
  if (key.includes('place')) return 'place'
  return 'default'
}

/** Large role-specific operator sprite (~28px tall) */
export function drawRoleAgent(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  accent: number,
  agent: Agent,
  frame: number,
) {
  const kind = resolveAgentRole(agent.role, agent.id)
  const bob = agent.status === 'working' ? Math.sin(frame * 0.14) * 3 : 0
  const py = y + bob
  const scale = 1.15

  g.fillStyle(0x000000, 0.45)
  g.fillEllipse(x, py + 16 * scale, 28 * scale, 10)

  if (agent.status === 'working' || agent.status === 'alert') {
    const pulse = 0.35 + Math.sin(frame * 0.11) * 0.35
    g.lineStyle(3, accent, pulse)
    g.strokeCircle(x, py, 22 + Math.sin(frame * 0.09) * 4)
    g.lineStyle(1, accent, pulse * 0.5)
    g.strokeCircle(x, py, 28 + Math.sin(frame * 0.07) * 5)
  }

  switch (kind) {
    case 'script':
      drawScriptAgent(g, x, py, accent, scale)
      break
    case 'voice':
      drawVoiceAgent(g, x, py, accent, scale, frame)
      break
    case 'edit':
      drawEditAgent(g, x, py, accent, scale)
      break
    case 'upload':
      drawUploadAgent(g, x, py, accent, scale, frame)
      break
    case 'scout':
      drawScoutAgent(g, x, py, accent, scale, frame)
      break
    case 'outreach':
      drawOutreachAgent(g, x, py, accent, scale, frame)
      break
    case 'reception':
      drawReceptionAgent(g, x, py, accent, scale)
      break
    case 'close':
      drawCloseAgent(g, x, py, accent, scale)
      break
    case 'prospect':
      drawProspectAgent(g, x, py, accent, scale)
      break
    case 'build':
      drawBuildAgent(g, x, py, accent, scale)
      break
    case 'deliver':
      drawDeliverAgent(g, x, py, accent, scale)
      break
    case 'scan':
      drawScanAgent(g, x, py, accent, scale, frame)
      break
    case 'signal':
      drawSignalAgent(g, x, py, accent, scale, frame)
      break
    case 'exec':
      drawExecAgent(g, x, py, accent, scale, frame)
      break
    case 'risk':
      drawRiskAgent(g, x, py, accent, scale)
      break
    case 'news':
      drawNewsAgent(g, x, py, accent, scale, frame)
      break
    case 'score':
      drawScoreAgent(g, x, py, accent, scale, frame)
      break
    case 'place':
      drawPlaceAgent(g, x, py, accent, scale)
      break
    default:
      drawDefaultAgent(g, x, py, accent, scale)
  }

  if (agent.status === 'idle') {
    g.fillStyle(accent, 0.4 + Math.sin(frame * 0.06) * 0.25)
    g.fillCircle(x + 14 * scale, py - 16 * scale, 3)
  }
}

function drawScriptAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 8 * s, y - 4 * s, 16 * s, 14 * s)
  g.fillStyle(accent, 1)
  g.fillRect(x - 6 * s, y - 14 * s, 12 * s, 10 * s)
  for (let i = 0; i < 4; i++) {
    g.fillStyle(accent, 0.5 - i * 0.08)
    g.fillRect(x - 5 * s, y - 2 * s + i * 3 * s, 10 * s - i, 2)
  }
}

function drawVoiceAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 7 * s, y, 14 * s, 12 * s)
  g.fillStyle(accent, 1)
  g.fillCircle(x, y - 10 * s, 9 * s)
  g.lineStyle(2, accent, 0.5 + Math.sin(frame * 0.2) * 0.4)
  for (let i = -2; i <= 2; i++) {
    const h = 4 + Math.abs(i) * 2 + Math.sin(frame * 0.25 + i) * 3
    g.lineBetween(x + i * 5 * s, y - 4 * s, x + i * 5 * s, y - 4 * s - h)
  }
}

function drawEditAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 9 * s, y - 2 * s, 18 * s, 14 * s)
  g.lineStyle(3, accent, 1)
  g.lineBetween(x - 8 * s, y + 8 * s, x + 2 * s, y - 12 * s)
  g.lineBetween(x + 2 * s, y - 12 * s, x + 10 * s, y - 6 * s)
  g.fillStyle(accent, 0.8)
  g.fillRect(x - 10 * s, y - 14 * s, 14 * s, 8 * s)
}

function drawUploadAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  const lift = Math.sin(frame * 0.1) * 2
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 8 * s, y + 2 * s, 16 * s, 12 * s)
  g.fillStyle(accent, 1)
  g.fillTriangle(x, y - 14 * s + lift, x - 8 * s, y - 2 * s + lift, x + 8 * s, y - 2 * s + lift)
  g.fillRect(x - 2 * s, y - 18 * s + lift, 4 * s, 6 * s)
}

function drawScoutAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 3 * s, y, 6 * s, 14 * s)
  g.fillStyle(accent, 0.9)
  g.fillTriangle(x, y - 16 * s, x - 12 * s, y - 4 * s, x + 12 * s, y - 4 * s)
  g.lineStyle(1, accent, 0.4)
  const sweep = (frame * 0.08) % (Math.PI * 2)
  g.lineBetween(x, y - 8 * s, x + Math.cos(sweep) * 14 * s, y - 8 * s + Math.sin(sweep) * 10 * s)
}

function drawOutreachAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 6 * s, y, 12 * s, 14 * s)
  g.fillStyle(accent, 1)
  g.fillCircle(x, y - 10 * s, 7 * s)
  for (let r = 0; r < 3; r++) {
    const expand = ((frame * 0.06 + r * 0.8) % 2)
    g.lineStyle(1, accent, 0.6 - expand * 0.25)
    g.strokeCircle(x, y - 10 * s, (8 + r * 5 + expand * 6) * s)
  }
}

function drawReceptionAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 7 * s, y, 14 * s, 14 * s)
  g.lineStyle(3, accent, 1)
  g.strokeCircle(x - 10 * s, y - 8 * s, 5 * s)
  g.strokeCircle(x + 10 * s, y - 8 * s, 5 * s)
  g.fillStyle(accent, 1)
  g.fillRect(x - 5 * s, y - 14 * s, 10 * s, 8 * s)
}

function drawCloseAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 7 * s, y + 2 * s, 14 * s, 12 * s)
  g.lineStyle(2, accent, 1)
  g.strokeTriangle(x, y - 16 * s, x - 10 * s, y - 2 * s, x + 10 * s, y - 2 * s)
  g.fillStyle(accent, 0.9)
  g.fillCircle(x, y - 6 * s, 4 * s)
}

function drawProspectAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 6 * s, y + 2 * s, 12 * s, 12 * s)
  g.lineStyle(2, accent, 1)
  g.strokeCircle(x + 6 * s, y - 6 * s, 9 * s)
  g.lineBetween(x + 6 * s, y - 6 * s, x + 14 * s, y - 14 * s)
  g.fillStyle(accent, 1)
  g.fillRect(x - 5 * s, y - 14 * s, 10 * s, 8 * s)
}

function drawBuildAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 8 * s, y + 4 * s, 16 * s, 10 * s)
  g.fillStyle(accent, 1)
  g.fillRect(x - 10 * s, y - 8 * s, 6 * s, 14 * s)
  g.fillRect(x + 2 * s, y - 12 * s, 8 * s, 4 * s)
  g.fillRect(x + 4 * s, y - 16 * s, 4 * s, 6 * s)
}

function drawDeliverAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(accent, 0.9)
  g.fillRect(x - 12 * s, y - 4 * s, 24 * s, 14 * s)
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 10 * s, y - 12 * s, 20 * s, 8 * s)
  g.lineStyle(2, accent, 1)
  g.lineBetween(x - 12 * s, y - 4 * s, x, y - 16 * s)
  g.lineBetween(x + 12 * s, y - 4 * s, x, y - 16 * s)
}

function drawScanAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 5 * s, y + 2 * s, 10 * s, 12 * s)
  g.lineStyle(2, accent, 1)
  g.strokeCircle(x, y - 8 * s, 12 * s)
  const a = frame * 0.12
  g.lineBetween(x, y - 8 * s, x + Math.cos(a) * 12 * s, y - 8 * s + Math.sin(a) * 12 * s)
  g.fillStyle(accent, 0.28)
  g.beginPath()
  g.moveTo(x, y - 8 * s)
  g.arc(x, y - 8 * s, 12 * s, a - 0.55, a)
  g.closePath()
  g.fillPath()
}

function drawSignalAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 6 * s, y + 2 * s, 12 * s, 12 * s)
  g.fillStyle(accent, 1)
  const flick = frame % 8 < 4 ? 1 : 0.6
  g.fillTriangle(x, y - 18 * s, x - 8 * s, y - 4 * s, x - 2 * s, y - 4 * s)
  g.fillStyle(accent, flick)
  g.fillTriangle(x, y - 14 * s, x + 2 * s, y - 6 * s, x + 10 * s, y - 16 * s)
}

function drawExecAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 6 * s, y + 2 * s, 12 * s, 12 * s)
  g.lineStyle(2, accent, 1)
  g.strokeCircle(x, y - 8 * s, 14 * s)
  g.lineBetween(x - 14 * s, y - 8 * s, x + 14 * s, y - 8 * s)
  g.lineBetween(x, y - 22 * s, x, y + 2 * s)
  if (frame % 20 < 10) {
    g.fillStyle(accent, 0.9)
    g.fillCircle(x, y - 8 * s, 3 * s)
  }
}

function drawRiskAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 6 * s, y + 4 * s, 12 * s, 10 * s)
  g.fillStyle(accent, 0.85)
  g.fillTriangle(x, y - 18 * s, x - 12 * s, y + 4 * s, x + 12 * s, y + 4 * s)
  g.fillStyle(0x0a1020, 1)
  g.fillCircle(x, y - 4 * s, 3 * s)
}

function drawNewsAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 4 * s, y, 8 * s, 14 * s)
  g.fillStyle(accent, 1)
  g.fillRect(x - 1 * s, y - 16 * s, 2 * s, 8 * s)
  for (let i = 0; i < 3; i++) {
    const wobble = Math.sin(frame * 0.15 + i) * 2
    g.fillRect(x - 10 * s + i * 3 * s, y - 14 * s + wobble, 2 * s, 6 * s)
  }
}

function drawScoreAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number, frame: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 7 * s, y + 2 * s, 14 * s, 12 * s)
  g.lineStyle(2, accent, 1)
  g.arc(x, y - 4 * s, 12 * s, -Math.PI * 0.85, -Math.PI * 0.15)
  g.strokePath()
  const pct = 0.3 + (Math.sin(frame * 0.05) + 1) * 0.35
  g.lineStyle(3, accent, 0.9)
  g.arc(x, y - 4 * s, 12 * s, -Math.PI * 0.85, -Math.PI * 0.85 + Math.PI * 0.7 * pct)
  g.strokePath()
}

function drawPlaceAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(accent, 0.25)
  g.fillRect(x - 12 * s, y - 10 * s, 24 * s, 18 * s)
  g.lineStyle(2, accent, 1)
  g.strokeRect(x - 12 * s, y - 10 * s, 24 * s, 18 * s)
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 6 * s, y + 2 * s, 12 * s, 12 * s)
  g.fillStyle(accent, 1)
  g.fillRect(x - 5 * s, y - 14 * s, 10 * s, 8 * s)
  g.fillStyle(accent, 0.8)
  g.fillRect(x - 8 * s, y - 6 * s, 16 * s, 3 * s)
}

function drawDefaultAgent(g: Phaser.GameObjects.Graphics, x: number, y: number, accent: number, s: number) {
  g.fillStyle(0x141c2e, 1)
  g.fillRect(x - 8 * s, y, 16 * s, 14 * s)
  g.fillStyle(accent, 1)
  g.fillRect(x - 6 * s, y - 14 * s, 12 * s, 10 * s)
}
