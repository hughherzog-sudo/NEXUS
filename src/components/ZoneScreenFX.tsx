/** Per-panel CRT / scanline / grid overlays on top of Phaser canvas */
export function ZoneScreenFX() {
  return (
    <>
      <div className="zone-panel__grid-texture" aria-hidden />
      <div className="zone-panel__scanlines" aria-hidden />
      <div className="zone-panel__crt-flicker" aria-hidden />
      <div className="zone-panel__vignette" aria-hidden />
    </>
  )
}
