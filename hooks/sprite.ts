// A walk cycle the desktop backdrop can play. Switching poses by animating
// `visibility` leaves Lewy invisible there (seen 15 and 16 Nov), while moving
// things (CSS transform) plays. So the poses sit side by side in a strip, a
// clip shows one pose's room, and the strip steps along one pose at a time.

/** Sprite coordinates (one pose is gw x gh); `id` must be unique in the drawing. */
export function walkStrip(poses: string[], gw: number, gh: number, strideS: number, id: string): string {
  const n = poses.length
  const strip = poses.map((p, i) => `<g transform="translate(${i * gw} 0)">${p}</g>`).join('')
  return `<clipPath id="${id}"><rect x="0" y="-1" width="${gw}" height="${gh + 2}"/></clipPath>` +
    `<g clip-path="url(#${id})"><g style="animation:${id}-walk ${strideS}s steps(${n}) infinite">${strip}</g></g>`
}

/** The keyframes walkStrip's strip needs, for the drawing's <style>. */
export function walkStripCss(n: number, gw: number, id: string): string {
  return `@keyframes ${id}-walk{from{transform:translateX(0)}to{transform:translateX(-${n * gw}px)}}`
}

/** The walk that played in grove's first version (16 Nov): every pose stacked,
 *  each shown for its slice of the stride by a stepped visibility animation. */
export function walkPoses(poses: string[], strideS: number): string {
  const n = poses.length
  return poses.map((p, i) => `<g class="pose" style="animation-delay:-${(Math.round(((n - i) % n) * (strideS / n) * 100) / 100)}s">${p}</g>`).join('')
}

export function walkPosesCss(n: number, strideS: number): string {
  return `.pose{visibility:hidden;animation:pose ${strideS}s step-end infinite}@keyframes pose{0%{visibility:visible}${Math.round(1000 / n) / 10}%{visibility:hidden}}`
}
