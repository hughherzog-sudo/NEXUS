import Phaser from 'phaser'
import type { Zone } from '../types'
import { ZoneScene, type ZoneSceneData } from './drawRoom'

const ZONE_VARIANTS: Record<string, number> = {
  'media-station': 0,
  'reception-corp': 1,
  'web-division': 1,
  'trade-desk': 3,
  'kalshi-ops': 2,
}

function makeZoneSceneClass(zone: Zone, variant: number) {
  const key = `zone-${zone.id}`
  return class extends ZoneScene {
    constructor() {
      super(key)
    }
    init() {
      super.init({ zone, variant } satisfies ZoneSceneData)
    }
  }
}

export function createZoneGame(
  parent: HTMLElement,
  zone: Zone,
  width: number,
  height: number,
): Phaser.Game {
  const variant = ZONE_VARIANTS[zone.id] ?? 0
  const SceneClass = makeZoneSceneClass(zone, variant)

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: '#050810',
    pixelArt: true,
    roundPixels: true,
    scale: { mode: Phaser.Scale.NONE },
    scene: SceneClass,
    fps: { target: 60 },
    audio: { noAudio: true },
  })
}

export function updateZoneGame(game: Phaser.Game, zone: Zone) {
  const scene = game.scene.getScene(`zone-${zone.id}`) as ZoneScene | undefined
  scene?.updateZone(zone)
}
