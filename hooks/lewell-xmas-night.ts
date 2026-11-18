// Christmas night: a snowy wood under a deep blue night, moonlit
// snow in soft blue-greys, so the string lights, star and windows glow. Made for
// the app's default dark theme. Same structure as every scene that walks.

import { NL_BLINK, NL_GRID, NL_IDLE, NL_WALK } from './night-lewy-pix'
import { walkPoses, walkPosesCss } from './sprite'
import { signpost } from './sticker'

const W = 1600, H = 900
const P = 6
const TAU = Math.PI * 2
const snap = (v: number) => Math.round(v / P) * P
let seed = 91
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const ridge = (base: number, waves: [number, number, number][]) => (x: number) =>
  base + waves.reduce((y, [a, k, ph]) => y + a * Math.sin((TAU * k * x) / W + ph), 0)

function stepHill(f: (x: number) => number, bottom: number, fill: string): string {
  let d = `M0 ${bottom}`
  for (let x = 0; x < W; x += P) d += `V${snap(f(x + P / 2))}H${x + P}`
  return `<path d="${d}V${bottom}Z" fill="${fill}"/>`
}

function outline(rows: [number, number, number][], fill: string): string {
  if (rows.length === 0) return ''
  let d = `M${rows[0]?.[2]} ${rows[0]?.[0]}`
  for (const [y, , x1] of rows) d += `H${x1}V${y + P}`
  for (let i = rows.length - 1; i >= 0; i--) { const [y, x0] = rows[i] ?? [0, 0]; d += `H${x0}V${y}` }
  return `<path d="${d}Z" fill="${fill}"/>`
}

function disc(cx: number, cy: number, r: number, fill: string, squash = 1): string {
  const rows: [number, number, number][] = []
  for (let y = -r; y < r; y += P) {
    const yc = y + P / 2, h = Math.sqrt(Math.max(0, r * r - yc * yc)) * squash
    if (h >= P / 2) rows.push([snap(cy + y), snap(cx - h), snap(cx + h)])
  }
  return outline(rows, fill)
}

// Christmas lights: bulbs gathered by colour while a layer is built, then drawn as
// one twinkling path per colour (few shapes, however many bulbs).
const BULBS = ['#ff4a4a', '#ffd25a', '#5fd38a', '#6ab0ff']
let bulbs: string[] = ['', '', '', '']
function bulb(x: number, y: number, i: number): void { bulbs[i % 4] += `M${snap(x)} ${snap(y)}h${P}v${P}h-${P}z` }
function takeLights(): string {
  // two groups (one per twinkle phase), so a layer runs 2 animations, not one per colour
  const phase = (k: number) => bulbs.map((d, i) => d && i % 2 === k ? `<path d="${d}" fill="${BULBS[i]}"/>` : '').join('')
  const out = `<g class="li0">${phase(0)}</g><g class="li1">${phase(1)}</g>`
  bulbs = ['', '', '', '']
  return out
}

// Warm glows (windows, lamps, the tree): gathered while a layer is built and drawn as
// one pulsing group, so the whole layer's glow is a single animation.
let glows = ''
function glow(cx: number, cy: number, r: number): string { glows += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#warm)"/>`; return '' }
function takeGlows(): string { const out = glows ? `<g class="gl">${glows}</g>` : ''; glows = ''; return out }

/** A fir of stacked tiers: the needles as one stepped shape, the snow on each tier as another. */
function fir(x: number, foot: number, h: number, body: string, snow: string, tiers = 4, lit = false): string {
  const rows: [number, number, number][] = [], caps: [number, number, number][] = []
  const tierH = h / tiers
  for (let y = -h; y < -h * 0.08; y += P) {
    const fromTop = y + h, t = Math.floor(fromTop / tierH), inTier = (fromTop - t * tierH) / tierH
    const w = (h * 0.12 + t * h * 0.075) * (0.35 + 0.65 * inTier) + P
    rows.push([snap(foot + y), snap(x - w), snap(x + w)])
    if (inTier < 0.3) caps.push([snap(foot + y), snap(x - w * 0.9), snap(x + w * 0.9)])
    if (lit && inTier > 0.78 && inTier < 0.95) for (let bx = -w + P; bx < w - P; bx += P * 3) bulb(x + bx, foot + y, Math.round((bx + w) / (P * 3)) + t)
  }
  const trunk = `<rect x="${snap(x - P)}" y="${snap(foot - h * 0.1)}" width="${2 * P}" height="${snap(h * 0.1) + P}" fill="#1c2030"/>`
  // caps come in runs per tier; draw each run as its own outline so they don't join
  let capPaths = '', run: [number, number, number][] = []
  for (const r of caps) {
    const last = run[run.length - 1]
    if (last && r[0] - last[0] > P) { capPaths += outline(run, snow); run = [] }
    run.push(r)
  }
  capPaths += outline(run, snow)
  return trunk + outline(rows, body) + capPaths
}

function christmasTree(x: number, foot: number, h: number): string {
  let out = fir(x, foot, h, 'url(#firXmas)', 'url(#snowCap)', 5, true)
  // red and gold baubles, one path each
  let red = '', gold = ''
  for (let i = 0; i < 18; i++) {
    const k = 0.2 + rand() * 0.72, y = foot - h + k * h * 0.9, w = (h * 0.12 + k * h * 0.33) * 0.75
    const bx = x + (rand() * 2 - 1) * w, d = `M${snap(bx)} ${snap(y)}h${P * 2}v${P * 2}h-${P * 2}z`
    if (i % 3) red += d; else gold += d
  }
  out += `<path d="${red}" fill="#d8323a"/><path d="${gold}" fill="#f2c14e"/>`
  // the star on top, glowing
  const sy = snap(foot - h) - P * 2
  out += glow(snap(x), sy, 40)
  out += `<path d="M${snap(x) - P} ${sy - P * 3}h${P * 2}v${P * 2}h${P * 2}v${P * 2}h-${P * 2}v${P * 2}h-${P * 2}v-${P * 2}h-${P * 2}v-${P * 2}h${P * 2}z" fill="#ffd94a" class="st"/>`
  return out
}

function house(x: number, foot: number, s: number, wall: string): string {
  const w = snap(56 * s), h = snap(40 * s), roofH = snap(34 * s)
  const left = snap(x - w / 2), top = snap(foot) - h
  let out = `<rect x="${left}" y="${top}" width="${w}" height="${h}" fill="${wall}"/>`
  // snowy roof as a stepped triangle with eaves
  const rows: [number, number, number][] = []
  for (let y = -roofH; y < 0; y += P) {
    const k = (y + roofH) / roofH, half = (w / 2 + P * 2) * k + P
    rows.push([top + y, snap(x - half), snap(x + half)])
  }
  out += outline(rows, 'url(#roof)')
  // glowing windows and a door
  out += glow(x, top + h * 0.45, 48 * s)
  out += `<rect x="${snap(left + w * 0.16)}" y="${snap(top + h * 0.28)}" width="${snap(12 * s) || P}" height="${snap(12 * s) || P}" fill="#ffcf72"/>`
  out += `<rect x="${snap(left + w * 0.62)}" y="${snap(top + h * 0.28)}" width="${snap(12 * s) || P}" height="${snap(12 * s) || P}" fill="#ffc35e"/>`
  out += `<rect x="${snap(x - 6 * s)}" y="${snap(foot - 20 * s)}" width="${snap(12 * s) || P}" height="${snap(20 * s)}" fill="#b8282f"/>`
  out += disc(x, top + h * 0.2, 7 * s + 3, '#2f7a46') + `<rect x="${snap(x) - P / 2}" y="${snap(top + h * 0.2) + P}" width="${P}" height="${P}" fill="#e2353c"/>`
  for (let bx = -w / 2 - P; bx <= w / 2 + P; bx += P * 2) bulb(x + bx, top - P, Math.round(bx / P))
  return out
}

function lamp(x: number, foot: number): string {
  let stripes = ''
  for (let y = snap(foot - 66); y < foot; y += P * 2) stripes += `M${snap(x)} ${y}h${P}v${P}h-${P}z`
  return `<rect x="${snap(x)}" y="${snap(foot - 66)}" width="${P}" height="66" fill="#f4f1ec"/><path d="${stripes}" fill="#d8323a"/>` +
    glow(snap(x) + 3, snap(foot - 72), 34) +
    `<rect x="${snap(x) - P}" y="${snap(foot - 78)}" width="${P * 3}" height="${P * 2}" fill="#ffd77e"/>` +
    `<rect x="${snap(x) - P}" y="${snap(foot - 84)}" width="${P * 3}" height="${P}" fill="#3a3f52"/>`
}

// ---- layers (each spans W and tiles with a copy at +W) ----
const farF = ridge(600, [[12, 1, 0.6], [8, 3, 2.0], [3, 9, 1.2]])
const midF = ridge(690, [[16, 2, 1.3], [8, 5, 0.4]])
const nearF = ridge(772, [[8, 1, 2.4], [5, 4, 1.1]])
const PATH_Y = 796

const FAR = stepHill(farF, H, 'url(#haze)') +
  (() => { let out = '', x = 10; while (x < W - 10) { out += fir(x, farF(x) + P * 2, 60 + rand() * 50, 'url(#firFar)', '#8e9aba', 3); x += 22 + rand() * 34 } return out })()
const MID = stepHill(midF, H, 'url(#snowMid)') +
  [180, 640, 1480].map((x, i) => fir(x, midF(x) + P * 2, 150 + (i % 2) * 40, 'url(#fir)', 'url(#snowCap)', 4, i === 1)).join('') +
  christmasTree(1110, midF(1110) + P * 2, 210) +
  signpost(300, midF(300) + 10, 30, true, true) +
  house(420, midF(420) + 8, 1.1, '#2c3f4a') + house(900, midF(900) + 8, 0.8, '#34405a') + house(1320, midF(1320) + 8, 1, '#303a52') +
  [520, 1000].map(x => lamp(x, midF(x) + 8)).join('') + takeGlows() + takeLights()
const NEAR = stepHill(nearF, H, 'url(#snowNear)') +
  `<path d="M0 ${PATH_Y - 18}${Array.from({ length: W / P }, (_, i) => `H${(i + 1) * P}V${snap(PATH_Y - 18 + Math.sin((TAU * 2 * i * P) / W) * 8)}`).join('')}V${PATH_Y + 26}H0Z" fill="url(#path)"/>` +
  [80, 560, 1040, 1460].map((x, i) => disc(x, nearF(x) + 16, 26 + (i % 2) * 10, 'url(#mound)', 1.6)).join('') +
  [300, 760, 1240].map((x, i) => fir(x, nearF(x) + 18, 70, 'url(#fir)', 'url(#snowCap)', 3, i !== 1)).join('') + takeGlows() + takeLights()

// ---- still pieces: sky, framing branches, falling snow ----
const branch = (x0: number, y0: number, dir: number, len: number) => {
  // a bough of stepped segments with twigs, frosted on top
  let wood = '', frost = '', x = x0, y = y0
  for (let i = 0; i < len; i++) {
    wood += `M${snap(x)} ${snap(y)}h${P * 3}v${P * 2}h-${P * 3}z`
    frost += `M${snap(x)} ${snap(y) - P}h${P * 3}v${P}h-${P * 3}z`
    if (i % 3 === 1) for (let k = 1; k < 5; k++) {
      wood += `M${snap(x + dir * k * P)} ${snap(y + k * P)}h${P}v${P}h-${P}z`
      frost += `M${snap(x + dir * k * P)} ${snap(y + k * P) - P}h${P}v${P}h-${P}z`
    }
    x += dir * P * 2.4; y += P * (0.6 + 0.4 * Math.sin(i * 0.7))
  }
  return `<path d="${wood}" fill="#2a3150"/><path d="${frost}" fill="#aeb9d6"/>`
}
const FRAME = branch(200, 240, 1, 18) + branch(250, 300, 1, 10) + branch(1400, 250, -1, 20) + branch(1380, 320, -1, 11)

// Falling snow as three sheets (far, middle, near), each one path moved by one
// animation, instead of 48 flakes animated one by one. Each sheet holds its flakes
// twice, one fall apart, so the loop joins without a seam.
const FALL = { dx: 40, dy: 720 }
const SNOW_SHEETS = [
  { n: 20, size: P / 2, opacity: 0.55, dur: 17 },
  { n: 16, size: P / 2, opacity: 0.72, dur: 13 },
  { n: 12, size: P, opacity: 0.88, dur: 9.5 },
]
const snowSheets = SNOW_SHEETS.map(({ n, size, opacity }) => {
  let d = ''
  for (let i = 0; i < n; i++) {
    rand()   // the old per-flake speed pick, kept so the stars drawn after the snow stay where they were
    const x = snap(200 + rand() * 1200), y = snap(200 + rand() * FALL.dy)
    for (const k of [0, 1]) d += `M${x - k * FALL.dx} ${y - k * FALL.dy}h${size}v${size}h-${size}z`
  }
  return { d, opacity }
})

// ---- Lewy ----
const LEWY_PX = 6.8
const LW = NL_GRID.w * LEWY_PX, LH = NL_GRID.h * LEWY_PX
const STEP_S = 1.5

function lewy(walking: boolean): string {
  const body = walking ? walkPoses(NL_WALK, STEP_S) : `${NL_IDLE}<g class="blink">${NL_BLINK}</g>`
  return `<path d="M${snap(W / 2 - LW * 0.3)} ${PATH_Y}h${snap(LW * 0.6)}v${P}h-${snap(LW * 0.6)}z" fill="#1a2036" opacity=".6"/>` +
    `<g class="px" transform="translate(${Math.round(W / 2 - LW / 2)} ${Math.round(PATH_Y + 4 - LH * 0.957)}) scale(${LEWY_PX}) translate(0 .5)">${body}</g>`
}

const STARS = (() => {
  let a = '', b = ''
  for (let i = 0; i < 40; i++) {
    const x = snap(220 + rand() * 1160), y = snap(240 + rand() * 260), sz = i % 9 === 0 ? P * 2 : P
    const d = `M${x} ${y}h${sz}v${sz}h-${sz}z`
    if (i % 2) a += d; else b += d
  }
  return `<path class="li0" d="${a}" fill="#e6e4ff"/><path class="li1" d="${b}" fill="#cfd2f2"/>`
})()

const SCROLL = { far: 300, mid: 150, near: 70 }
// Moving parts step at FPS frames a second instead of gliding at the screen's rate:
// it suits the pixel look and lets the app redraw far less often, so the walk keeps
// going when the app is busy (founder, 18 Nov: the scene froze under load)
const FPS = 12
const steps = (durS: number) => `steps(${Math.max(1, Math.round(durS * FPS))})`
const ZOOM = { x: 200, y: 225, w: 1200, h: 675 }

export function lewellXmasNightScene(walking: boolean, walkedMs: number): string {
  const t = walkedMs / 1000
  const layer = (id: keyof typeof SCROLL, body: string) => {
    const dur = SCROLL[id], off = -((t / dur) * W) % W
    const anim = walking ? ` style="animation:scroll ${dur}s ${steps(dur)} -${Math.round((t % dur) * 10) / 10}s infinite"` : ` transform="translate(${Math.round(off)} 0)"`
    return `<g${anim}><g id="${id}">${body}</g><use href="#${id}" x="${W}"/></g>`
  }
  const style = `
.px path{fill:none;stroke-width:1.04}
.gl{animation:gl 4s ${steps(4)} infinite alternate}
.li0{animation:li 1.6s steps(1) infinite}.li1{animation:li 1.6s steps(1) -.8s infinite}
.st{animation:gl 2s ${steps(2)} infinite alternate}
${SNOW_SHEETS.map(({ dur }, i) => `.sn${i}{animation:fall ${dur}s ${steps(dur)} -${(i * 3.1).toFixed(1)}s infinite}`).join('')}
.blink{visibility:hidden;animation:blink 4.2s step-end infinite}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-${W}px)}}
@keyframes fall{from{transform:translate(0,0)}to{transform:translate(${FALL.dx}px,${FALL.dy}px)}}
@keyframes gl{from{opacity:.7}to{opacity:1}}
@keyframes li{0%{opacity:1}50%{opacity:.35}}
${walkPosesCss(NL_WALK.length, STEP_S)}
@keyframes blink{0%{visibility:hidden}95%{visibility:visible}98.5%{visibility:hidden}}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ZOOM.x} ${ZOOM.y} ${ZOOM.w} ${ZOOM.h}" width="100%" height="100%" preserveAspectRatio="xMidYMax slice"><style>${style}</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stop-color="#0d1122"/><stop offset=".5" stop-color="#18203a"/><stop offset=".68" stop-color="#2a3352"/></linearGradient>
<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset=".64" stop-color="#3c4766"/><stop offset=".8" stop-color="#2c3550"/></linearGradient>
<linearGradient id="firFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e4a4c"/><stop offset="1" stop-color="#1f3437"/></linearGradient>
<linearGradient id="fir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6a48"/><stop offset=".6" stop-color="#1a4630"/><stop offset="1" stop-color="#0f2a1c"/></linearGradient>
<linearGradient id="firXmas" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#367a52"/><stop offset=".6" stop-color="#1f5236"/><stop offset="1" stop-color="#11301f"/></linearGradient>
<linearGradient id="snowCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d4ec"/><stop offset="1" stop-color="#7f8db0"/></linearGradient>
<linearGradient id="snowMid" x1="0" y1="0" x2="0" y2="1"><stop offset=".74" stop-color="#7584a8"/><stop offset=".9" stop-color="#4a5678"/></linearGradient>
<linearGradient id="snowNear" x1="0" y1="0" x2="0" y2="1"><stop offset=".84" stop-color="#8592b4"/><stop offset="1" stop-color="#3a4462"/></linearGradient>
<linearGradient id="path" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ba8c8"/><stop offset="1" stop-color="#6d7a9e"/></linearGradient>
<radialGradient id="mound" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#b7c3df"/><stop offset="1" stop-color="#5a6688"/></radialGradient>
<linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdd7ee"/><stop offset="1" stop-color="#7a87aa"/></linearGradient>
<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffc56a" stop-opacity=".6"/><stop offset="1" stop-color="#ffc56a" stop-opacity="0"/></radialGradient>
<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e9e6d2" stop-opacity=".25"/><stop offset="1" stop-color="#e9e6d2" stop-opacity="0"/></radialGradient>
</defs>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#sky)"/>${STARS}<circle cx="560" cy="330" r="120" fill="url(#halo)"/>${disc(560, 330, 34, '#ece8d4')}${disc(572, 340, 7, '#d9d4bc')}
${layer('far', FAR)}${layer('mid', MID)}${layer('near', NEAR)}
${lewy(walking)}
${snowSheets.map(({ d, opacity }, i) => `<path class="sn${i}" d="${d}" fill="#dfe6f6" opacity="${opacity}"/>`).join('')}${FRAME}
</svg>`
}
