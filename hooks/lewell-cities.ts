// City scenes: Lewy walks the evening streets of seven cities past their
// landmarks: Bangkok (Wat Arun, the Grand Palace), Tokyo (Tokyo Tower, the Skytree,
// Fuji, a torii), Paris (the Eiffel Tower, the Arc de Triomphe), London (Big Ben,
// Parliament, the London Eye), New York (the Empire State, the Chrysler, Liberty),
// San Francisco (the Golden Gate, the Transamerica Pyramid, Coit Tower) and
// Singapore (Marina Bay Sands, the Supertrees, the Flyer, the Merlion). The tour
// changes city every CITY_S seconds of walking; each city is also a scene alone.
// Original pixel art made the way the desktop backdrop animates: few stepped
// shapes and thin strokes, one path per colour for lights, the street copied with
// <use> and scrolled, the landmarks drifting slowly behind it.

import { NL_BLINK, NL_GRID, NL_IDLE, NL_WALK } from './night-lewy-pix'
import { walkPoses, walkPosesCss } from './sprite'
import { STICKER_H, STICKER_W, sticker } from './sticker'

const W = 1600, H = 900
const P = 6
const snap = (v: number) => Math.round(v / P) * P
let seed = 101
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const reseed = (s: number) => { seed = s }
const f1 = (n: number) => (Math.round(n * 10) / 10).toString()

export const CITY_S = 30 // seconds of walking in each city

function outline(rows: [number, number, number][], fill: string, extra = ''): string {
  if (rows.length === 0) return ''
  let d = `M${rows[0]?.[2]} ${rows[0]?.[0]}`
  for (const [y, , x1] of rows) d += `H${x1}V${y + P}`
  for (let i = rows.length - 1; i >= 0; i--) { const [y, x0] = rows[i] ?? [0, 0]; d += `H${x0}V${y}` }
  return `<path d="${d}Z" fill="${fill}"${extra}/>`
}

/** A shape whose half-width at height t (0 top .. 1 bottom) is w(t), centred on x. */
function profile(x: number, top: number, h: number, w: (t: number) => number, fill: string, extra = ''): string {
  const rows: [number, number, number][] = []
  for (let y = 0; y < h; y += P) rows.push([snap(top + y), snap(x - Math.max(P / 2, w(y / h))), snap(x + Math.max(P / 2, w(y / h)))])
  return outline(rows, fill, extra)
}

const disc = (cx: number, cy: number, r: number, fill: string, extra = '') =>
  profile(cx, cy - r, 2 * r, t => Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)) * r, fill, extra)
const dome = (cx: number, base: number, r: number, fill: string) =>
  profile(cx, base - r, r, t => Math.sqrt(Math.max(0, 1 - (1 - t) ** 2)) * r, fill)
const rect = (x: number, y: number, w: number, h: number, fill: string, extra = '') =>
  `<rect x="${snap(x)}" y="${snap(y)}" width="${Math.max(P, snap(w))}" height="${Math.max(P, snap(h))}" fill="${fill}"${extra}/>`
const strokes = (d: string, colour: string, width: number, extra = '') =>
  `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}"${extra}/>`
/** Small squares gathered into one path (lights, sparkles). */
const squares = (pts: [number, number][], size: number) => pts.map(([x, y]) => `M${f1(x)} ${f1(y)}h${size}v${size}h-${size}z`).join('')
const water = (y: number, h: number, a: string, b: string, glint: string) => {
  reseed(Math.round(y))
  let d = ''
  for (let i = 0; i < 40; i++) d += `M${snap(200 + rand() * 1200)} ${snap(y + 6 + rand() * (h - 12))}h${snap(10 + rand() * 40)}v2h-${snap(10 + rand() * 40)}z`
  return `<rect x="0" y="${y}" width="${W}" height="${h}" fill="url(#wt)"/><path class="li0" d="${d}" fill="${glint}" opacity=".55"/>` +
    `<defs><linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`
}

export type SignKind = 'thai' | 'neon' | 'paris' | 'pub' | 'marquee' | 'victorian' | 'lightbox'
type City = { sky: [string, string, string, string]; scene: string; ground: [string, string]; sign: SignKind }

// ---- Bangkok: Wat Arun on the Chao Phraya ----
function bangkok(): City {
  const X = 1110, base = 640
  const prangW = (h: number) => (t: number) => (t < 0.55 ? 6 + Math.pow(t / 0.55, 1.6) * h * 0.115 : h * 0.115 + 6 + (t - 0.55) * h * 0.42)
  const prang = (x: number, b: number, h: number) => {
    const w = prangW(h)
    let out = profile(x, b - h, h, w, 'url(#arun)')
    out += [0.22, 0.36, 0.5, 0.64, 0.78, 0.9].map(f => rect(x - w(f), b - h + h * f, 2 * w(f), 4, '#f6e2c2', ' opacity=".85"')).join('')
    out += rect(x - 6, b - h + h * 0.7, 12, 18, '#5a3a30') // a niche
    out += rect(x - 1, b - h - 26, 3, 26, '#f0d08a') + rect(x - 8, b - h - 18, 16, 3, '#f0d08a') // trident tip
    return out
  }
  const terraces = rect(X - 170, base, 340, 14, '#a07a5e') + rect(X - 140, base - 14, 280, 14, '#b48c6c') + rect(X - 110, base - 26, 220, 12, '#c49c7a')
  const boat = `<path d="M330 702q60 14 150 0l-10 10q-60 8-130 0z" fill="#1c1218"/><path d="M370 690h70v8h-70z" fill="#5a2a2a"/>`
  return {
    sky: ['#1a1430', '#3a2348', '#8a4a52', '#e0905a'],
    scene: water(660, 90, '#5a3550', '#24162c', '#ffb070') + terraces +
      prang(X - 120, base - 6, 150) + prang(X + 120, base - 6, 150) + prang(X, base - 26, 320) + grandPalace() + boat,
    ground: ['#3a2c34', '#1f181e'],
    sign: 'thai',
  }
}

// ---- Tokyo: Tokyo Tower and Mt Fuji ----
function tokyo(): City {
  const X = 1130, top = 290, h = 400
  const w = (t: number) => 5 + Math.pow(t, 1.9) * 82
  let tower = profile(X, top, h, w, 'url(#tokyo)')
  tower += [0.3, 0.56, 0.8].map(f => rect(X - w(f), top + h * f, 2 * w(f), 10, '#f3eee8')).join('')
  // lattice: crossing braces in each red section
  let lat = ''
  const cuts = [0.06, 0.3, 0.42, 0.56, 0.68, 0.8, 0.92, 1]
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i] ?? 0, b = cuts[i + 1] ?? 1, ya = top + h * a, yb = top + h * b
    lat += `M${f1(X - w(a))} ${f1(ya)}L${f1(X + w(b))} ${f1(yb)}M${f1(X + w(a))} ${f1(ya)}L${f1(X - w(b))} ${f1(yb)}`
  }
  tower += strokes(lat, '#8a2416', 2, ' opacity=".8"')
  const deck = rect(X - w(0.45) - 16, top + h * 0.43, 2 * w(0.45) + 32, 24, '#3a2a30') + rect(X - w(0.45) - 12, top + h * 0.45, 2 * w(0.45) + 24, 8, '#ffe2a0')
  const topDeck = rect(X - 20, top + h * 0.17, 40, 14, '#3a2a30') + rect(X - 16, top + h * 0.18, 32, 5, '#ffe2a0')
  const antenna = rect(X - 2, top - 70, 4, 72, '#f3eee8') + rect(X - 2, top - 40, 4, 10, '#e2402a')
  const lights: [number, number][] = []
  for (let f = 0.08; f < 1; f += 0.06) { lights.push([X - w(f) - 3, top + h * f]); lights.push([X + w(f) - 1, top + h * f]) }
  const fujiW = (t: number) => 26 + t * 300
  const fuji = profile(540, 430, 250, fujiW, 'url(#fuji)') +
    profile(540, 430, 70, t => 26 + t * 84, '#eef1f8') +
    [[-40, 72], [-10, 84], [26, 78], [52, 68]].map(([dx, dy]) => profile(540 + (dx ?? 0), 430 + (dy ?? 0) - 16, 22, t => 4 + (1 - t) * 8, '#eef1f8')).join('')
  return {
    sky: ['#10142e', '#243064', '#5a4a8a', '#c07aa0'],
    scene: fuji + rect(0, 680, W, 70, '#1a2040') + tower + deck + topDeck + antenna + `<path class="li1" d="${squares(lights, 3)}" fill="#fff2b0"/>` + skytree() + torii(520, 690),
    ground: ['#262a40', '#14162a'],
    sign: 'neon',
  }
}

// ---- Paris: the Eiffel Tower, sparkling ----
function paris(): City {
  const X = 1120, top = 250, h = 440
  const w = (t: number) => 3 + Math.pow(t, 2.3) * 112
  let tower = profile(X, top, h, w, 'url(#eiffel)')
  tower += dome(X, top + h, 46, '#1c1a30')
  let lat = ''
  const cuts = [0.1, 0.2, 0.3, 0.38, 0.5, 0.64, 0.74, 0.86]
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i] ?? 0, b = cuts[i + 1] ?? 1, ya = top + h * a, yb = top + h * b
    lat += `M${f1(X - w(a))} ${f1(ya)}L${f1(X + w(b))} ${f1(yb)}M${f1(X + w(a))} ${f1(ya)}L${f1(X - w(b))} ${f1(yb)}`
  }
  tower += strokes(lat, '#7a4a20', 1.6, ' opacity=".75"')
  tower += [[0.36, 12, 14], [0.64, 16, 20], [0.1, 6, 6]].map(([f, hh, ext]) => rect(X - w(f ?? 0) - (ext ?? 0), top + h * (f ?? 0), 2 * w(f ?? 0) + 2 * (ext ?? 0), hh ?? 8, '#f4c870')).join('')
  reseed(31)
  const sparkle: [number, number][] = []
  for (let i = 0; i < 46; i++) { const f = 0.05 + rand() * 0.82; sparkle.push([X + (rand() * 2 - 1) * w(f), top + h * f]) }
  const beacon = `<circle cx="${X}" cy="${top}" r="26" fill="url(#beam)" class="gl"/>`
  const trees = Array.from({ length: 9 }, (_, i) => disc(880 + i * 66, 696, 22, '#1e2a26')).join('')
  return {
    sky: ['#121630', '#2a2d5a', '#6a5a8a', '#d8a080'],
    scene: rect(0, 690, W, 60, '#1c1a2c') + tower + beacon + `<path class="li0" d="${squares(sparkle.slice(0, 23), 3)}" fill="#ffffff"/><path class="li1" d="${squares(sparkle.slice(23), 3)}" fill="#fff4c8"/>` + trees + arcDeTriomphe(),
    ground: ['#2a2838', '#16141e'],
    sign: 'paris',
  }
}

// ---- London: Big Ben, Parliament, Westminster Bridge over the Thames ----
function london(): City {
  const X = 1050
  const stone = 'url(#stone)'
  let ben = rect(X - 30, 360, 60, 330, stone)
  ben += strokes(`M${X - 18} 470V690M${X - 6} 470V690M${X + 6} 470V690M${X + 18} 470V690`, '#d8c89a', 1.4, ' opacity=".7"')
  ben += [520, 580, 640].map(y => rect(X - 32, y, 64, 4, '#8a7a5a')).join('')
  ben += rect(X - 38, 380, 76, 76, stone) + disc(X, 418, 28, '#d6c38a') + disc(X, 418, 23, '#f6e8b6', ' class="gl"')
  ben += strokes(Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${f1(X + Math.cos(a) * 18)} ${f1(418 + Math.sin(a) * 18)}L${f1(X + Math.cos(a) * 21)} ${f1(418 + Math.sin(a) * 21)}` }).join(''), '#5a4630', 2)
  ben += strokes(`M${X} 418V402M${X} 418L${X + 12} 422`, '#3a2c20', 2.4)
  ben += [X - 24, X - 8, X + 8].map(x => rect(x, 462, 10, 18, '#3a3020')).join('') // belfry openings
  ben += profile(X, 270, 90, t => 4 + t * 36, 'url(#roof)') + profile(X, 236, 36, () => 2, '#c8b070')
  ben += [-34, 34].map(dx => profile(X + dx, 356, 26, t => 1 + t * 5, '#8a7a5a')).join('')
  // Parliament along the river
  let parl = rect(1090, 560, 320, 130, stone)
  const wins: [number, number][] = []
  for (let wx = 1100; wx < 1400; wx += 14) for (let wy = 580; wy < 680; wy += 22) wins.push([wx, wy])
  parl += `<path class="li0" d="${squares(wins, 5)}" fill="#ffe0a0" opacity=".9"/>`
  parl += Array.from({ length: 11 }, (_, i) => profile(1100 + i * 30, 534, 28, t => 1 + t * 6, '#8a7a5a')).join('')
  // Westminster Bridge and the Thames
  const bridge = rect(200, 680, 820, 14, '#2e5a48') + Array.from({ length: 6 }, (_, i) => dome(260 + i * 135, 712, 48, '#16202c')).join('')
  return {
    sky: ['#121a2a', '#24344a', '#4a5a6a', '#9aa0a0'],
    scene: londonEye() + water(690, 60, '#2a3a4a', '#121a24', '#ffe0a0') + parl + ben + bridge,
    ground: ['#262c32', '#14181c'],
    sign: 'pub',
  }
}

// ---- New York: Empire State and Chrysler ----
function newYork(): City {
  const X = 1060
  const tiers = [[690, 130, 170], [520, 100, 110], [410, 76, 70], [340, 54, 36], [304, 42, 22]] as const
  let es = ''
  for (const [y, w, hh] of tiers) {
    es += rect(X - w / 2, y - hh, w, hh, 'url(#deco)')
    let d = ''
    for (let x = X - w / 2 + 8; x < X + w / 2 - 6; x += 12) d += `M${x} ${y - hh + 4}V${y}`
    es += strokes(d, '#ffe6a8', 1.4, ' opacity=".55" class="li0"')
  }
  es += rect(X - 3, 196, 6, 90, '#c9c3e6') + `<circle cx="${X}" cy="196" r="18" fill="url(#beam)" class="gl"/>`
  es += rect(X - 21, 296, 42, 6, '#ff7ac0') + rect(X - 27, 330, 54, 6, '#ffd27a') + rect(X - 38, 404, 76, 6, '#9ad8ff')
  // Chrysler: stacked sunburst arches with triangle windows, a needle spire
  const C = 1300
  let ch = rect(C - 40, 430, 80, 260, 'url(#deco)')
  for (let i = 0; i < 6; i++) {
    const r = 40 - i * 6.5, b = 430 - i * 16
    ch += dome(C, b, r, i % 2 ? '#c8c8dc' : '#9a9ab8') + profile(C, b - r * 0.55, r * 0.4, t => 2 + t * 4, '#ffe6a8', ' class="li1"')
  }
  ch += profile(C, 300, 40, () => 1.5, '#e8e8f4')
  return {
    sky: ['#0e1226', '#1f2a52', '#4a3a6a', '#b06a6a'],
    scene: rect(0, 690, W, 60, '#14162a') + es + ch + liberty(),
    ground: ['#24283a', '#121420'],
    sign: 'marquee',
  }
}

// ---- San Francisco: the Golden Gate in the fog ----
function sanFrancisco(): City {
  const t1 = 440, t2 = 1180, topY = 320, deckY = 640
  const tower = (x: number) =>
    rect(x - 26, topY, 14, deckY + 70 - topY, 'url(#gg)') + rect(x + 12, topY, 14, deckY + 70 - topY, 'url(#gg)') +
    [topY, topY + 70, topY + 150, topY + 230].map(y => rect(x - 26, y, 52, 12, '#b8381e')).join('') +
    rect(x - 30, topY - 8, 60, 10, '#c4401f')
  const cable = (a: [number, number], b: [number, number], sag: number) =>
    `M${a[0]} ${a[1]}Q${(a[0] + b[0]) / 2} ${Math.max(a[1], b[1]) + sag} ${b[0]} ${b[1]}`
  const main = cable([t1, topY + 4], [t2, topY + 4], 560) + cable([100, deckY - 10], [t1, topY + 4], -40) + cable([t2, topY + 4], [1500, deckY - 10], -40)
  // suspenders from the main span cable down to the deck
  let hang = ''
  for (let x = t1 + 20; x < t2 - 10; x += 18) {
    const s = (x - t1) / (t2 - t1), y = (1 - s) * (1 - s) * (topY + 4) + 2 * (1 - s) * s * (topY + 4 + 560) + s * s * (topY + 4)
    hang += `M${x} ${f1(y)}V${deckY}`
  }
  const deckLights: [number, number][] = Array.from({ length: 44 }, (_, i) => [140 + i * 30, deckY + 3])
  const hills = profile(200, 560, 120, t => 120 + t * 220, '#1c2a34') + profile(1420, 580, 100, t => 90 + t * 200, '#1a2630')
  const fog = [[320, 690, 260], [760, 700, 300], [1240, 688, 240]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="26" fill="#c9cfe0" opacity=".18"/>`).join('')
  return {
    sky: ['#0f1a2e', '#22365a', '#5a5a7a', '#d88a6a'],
    scene: sfExtras() + hills + water(680, 70, '#24384a', '#101a26', '#ffcf9a') + tower(t1) + tower(t2) +
      rect(100, deckY, 1400, 14, '#a8341c') + strokes(main, '#c8401f', 5) + strokes(hang, '#c8401f', 1.4, ' opacity=".8"') +
      `<path class="li0" d="${squares(deckLights, 4)}" fill="#ffd98a"/>` + fog,
    ground: ['#2a2c38', '#15161e'],
    sign: 'victorian',
  }
}

// ---- more landmarks, mostly on the left so they never hide behind Lewy ----

/** Bangkok: the Grand Palace's stacked orange-and-green roofs and a gold prasat spire. */
function grandPalace(): string {
  const roof = (x: number, base: number, w: number, tiers: number) => {
    let out = ''
    for (let i = 0; i < tiers; i++) {
      const ww = w - i * 22, y = base - i * 20
      out += `<path d="M${x - ww / 2} ${y}L${x} ${y - 30}L${x + ww / 2} ${y}Z" fill="${i % 2 ? '#d86a2a' : '#c4502a'}" stroke="#3a8a5a" stroke-width="3"/>`
      out += `<path d="M${x - ww / 2} ${y}q-8 -6 -6 -14M${x + ww / 2} ${y}q8 -6 6 -14" fill="none" stroke="#e8b84a" stroke-width="2"/>`
    }
    return out
  }
  return rect(260, 600, 300, 90, '#e8e0cc') + strokes(Array.from({ length: 9 }, (_, i) => `M${280 + i * 32} 618v52`).join(''), '#b8a888', 4) +
    roof(330, 600, 150, 3) + roof(490, 600, 130, 3) +
    profile(410, 430, 170, t => 3 + Math.pow(t, 1.4) * 34, 'url(#gold)') +
    [0.35, 0.55, 0.75].map(f => rect(410 - (3 + Math.pow(f, 1.4) * 34), 430 + 170 * f, 2 * (3 + Math.pow(f, 1.4) * 34), 4, '#fff0b0')).join('')
}

/** Tokyo: the Skytree, and a red torii at the water's edge. */
function skytree(): string {
  const X = 320, top = 210, h = 470
  const w = (t: number) => 3 + Math.pow(t, 2.2) * 40
  return profile(X, top, h, w, 'url(#skytree)') +
    strokes(Array.from({ length: 10 }, (_, i) => { const a = 0.3 + i * 0.07, b = a + 0.07; return `M${f1(X - w(a))} ${f1(top + h * a)}L${f1(X + w(b))} ${f1(top + h * b)}M${f1(X + w(a))} ${f1(top + h * a)}L${f1(X - w(b))} ${f1(top + h * b)}` }).join(''), '#7a8ab0', 1.2, ' opacity=".7"') +
    rect(X - 22, top + h * 0.48, 44, 16, '#c8d4ee') + rect(X - 18, top + h * 0.5, 36, 6, '#9ad8ff', ' class="li0"') +
    rect(X - 14, top + h * 0.3, 28, 12, '#c8d4ee') + rect(X - 11, top + h * 0.31, 22, 4, '#c8a0ff', ' class="li1"') +
    rect(X - 2, top - 50, 4, 52, '#e8eef8')
}
function torii(x: number, base: number): string {
  return rect(x - 34, base - 70, 8, 70, '#d8402a') + rect(x + 26, base - 70, 8, 70, '#d8402a') +
    `<path d="M${x - 50} ${base - 78}q50 -10 100 0v8h-100z" fill="#d8402a"/>` + rect(x - 40, base - 62, 80, 6, '#c8361e') + rect(x - 50, base - 86, 100, 6, '#2a1a1a')
}

/** Paris: the Arc de Triomphe. */
function arcDeTriomphe(): string {
  const X = 380, base = 690
  return rect(X - 70, base - 130, 140, 130, 'url(#stone)') + dome(X, base - 66, 26, '#1c1a2c') + rect(X - 26, base - 66, 52, 66, '#1c1a2c') +
    dome(X - 52, base - 30, 9, '#1c1a2c') + rect(X - 61, base - 30, 18, 30, '#1c1a2c') + dome(X + 52, base - 30, 9, '#1c1a2c') + rect(X + 43, base - 30, 18, 30, '#1c1a2c') +
    rect(X - 76, base - 140, 152, 12, '#a8946a') + rect(X - 72, base - 150, 144, 10, '#c4ac7a') +
    strokes(`M${X - 60} ${base - 100}h24M${X + 36} ${base - 100}h24M${X - 60} ${base - 80}h24M${X + 36} ${base - 80}h24`, '#8a7a5a', 2)
}

/** London: the London Eye. */
function londonEye(): string {
  const X = 330, Y = 520, R = 128
  let sp = ''
  const caps: [number, number][] = []
  for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2; if (i % 2 === 0) sp += `M${X} ${Y}L${f1(X + Math.cos(a) * R)} ${f1(Y + Math.sin(a) * R)}`; caps.push([X + Math.cos(a) * R - 4, Y + Math.sin(a) * R - 3]) }
  return `<circle cx="${X}" cy="${Y}" r="${R}" fill="none" stroke="#dfe6f2" stroke-width="3"/>` + strokes(sp, '#aab4c8', 1, ' opacity=".7"') +
    `<path class="li0" d="${squares(caps, 7)}" fill="#bfe0ff"/>` + disc(X, Y, 9, '#dfe6f2') +
    strokes(`M${X} ${Y}L${X - 50} 690M${X} ${Y}L${X - 20} 690`, '#c8d0e0', 4)
}

/** New York: the Statue of Liberty on her pedestal, the torch alight. */
function liberty(): string {
  const X = 360, base = 690
  return rect(X - 40, base - 110, 80, 110, 'url(#stone)') + rect(X - 50, base - 120, 100, 12, '#a8946a') +
    profile(X, base - 260, 140, t => 8 + t * 22, 'url(#verdigris)') +
    disc(X, base - 272, 13, '#6fb59a') +
    strokes(Array.from({ length: 7 }, (_, i) => { const a = Math.PI + (i / 6) * Math.PI; return `M${f1(X + Math.cos(a) * 13)} ${f1(base - 276 + Math.sin(a) * 13)}l${f1(Math.cos(a) * 10)} ${f1(Math.sin(a) * 10)}` }).join(''), '#8fd0b4', 2.2) +
    `<path d="M${X + 14} ${base - 240}l14 -64h8l-10 64z" fill="url(#verdigris)"/>` +
    rect(X + 22, base - 316, 12, 10, '#5a9a80') + `<circle cx="${X + 28}" cy="${base - 322}" r="22" fill="url(#beam)" class="gl"/>` + disc(X + 28, base - 322, 6, '#ffd27a') +
    rect(X - 26, base - 220, 16, 6, '#5a9a80')
}

/** San Francisco: the Transamerica Pyramid and Coit Tower on Telegraph Hill. */
function sfExtras(): string {
  const pyr = profile(1330, 360, 330, t => 3 + t * 40, 'url(#deco)') +
    [{ f: 0.3 }, { f: 0.55 }, { f: 0.8 }].map(({ f }) => rect(1330 - (3 + f * 40), 360 + 330 * f, 2 * (3 + f * 40), 3, '#ffe6a8', ' class="li1" opacity=".8"')).join('') +
    rect(1330 - 1, 330, 2, 32, '#ffd27a')
  const coit = rect(258, 470, 30, 100, '#e8e2d2') + rect(254, 462, 38, 10, '#cfc8b4') + strokes('M263 480v84M273 480v84M283 480v84', '#b8b0a0', 2)
  return pyr + coit
}

// ---- Singapore: Marina Bay Sands and the Supertrees ----
function singapore(): City {
  const base = 690, top = 320
  let mbs = ''
  for (const x of [1010, 1110, 1210]) {
    // each tower: two slabs leaning together, lit window lines
    mbs += profile(x, top, base - top, t => 22 + t * 8, 'url(#mbs)')
    let d = ''
    for (let y = top + 14; y < base - 8; y += 12) d += `M${x - 20 + 4} ${y}h${32}`
    mbs += strokes(d, '#ffe2a8', 1.2, ' opacity=".55" class="li0"')
    mbs += rect(x - 2, top + 6, 4, base - top - 10, '#2a2a40', ' opacity=".6"')
  }
  // the SkyPark: a long deck across the three tops, overhanging to the north
  mbs += rect(950, top - 18, 380, 16, '#c8ccd8') + rect(950, top - 4, 380, 4, '#7a8090') +
    `<path d="M1330 ${top - 18}h40v8h-40z" fill="#c8ccd8"/>` + rect(980, top - 26, 300, 8, '#3a5a4a')
  mbs += `<path class="li1" d="${squares(Array.from({ length: 24 }, (_, i) => [956 + i * 16, top - 12] as [number, number]), 3)}" fill="#bfe8ff"/>`
  // Supertrees: flared trunks with glowing canopy rings
  const supertree = (x: number, h: number) =>
    profile(x, base - h, h, t => 4 + Math.pow(1 - t, 3) * 34 + t * 4, 'url(#steel)') +
    profile(x, base - h - 6, 16, t => 40 - t * 4, '#6a3a8a') +
    `<path class="${h > 150 ? 'li0' : 'li1'}" d="${squares(Array.from({ length: 12 }, (_, i) => [x - 36 + i * 6, base - h - 2] as [number, number]), 3)}" fill="#ff8ae0"/>` +
    `<ellipse cx="${x}" cy="${base - h}" rx="56" ry="14" fill="#c86aff" opacity=".18" class="gl"/>`
  const trees = supertree(260, 170) + supertree(360, 220) + supertree(470, 150) + supertree(560, 190)
  // the Singapore Flyer: rim, spokes, lit capsules, A-frame legs
  const FX = 360, FY = 450, FR = 118
  let spokes = '', caps: [number, number][] = []
  for (let i = 0; i < 28; i++) {
    const ang = (i / 28) * Math.PI * 2, cx = FX + Math.cos(ang) * FR, cy = FY + Math.sin(ang) * FR
    if (i % 2 === 0) spokes += `M${FX} ${FY}L${f1(cx)} ${f1(cy)}`
    caps.push([cx - 3, cy - 3])
  }
  const flyer = `<circle cx="${FX}" cy="${FY}" r="${FR}" fill="none" stroke="#9aa6c8" stroke-width="3"/>` +
    `<circle cx="${FX}" cy="${FY}" r="${FR - 8}" fill="none" stroke="#6a7090" stroke-width="1.5"/>` +
    strokes(spokes, '#7a84a8', 1, ' opacity=".7"') +
    `<path class="li1" d="${squares(caps, 6)}" fill="#bfe8ff"/>` + disc(FX, FY, 10, '#c8ccd8') +
    strokes(`M${FX} ${FY}L${FX - 70} ${base}M${FX} ${FY}L${FX + 70} ${base}`, '#5a6080', 5)
  // the Merlion: a white lion head and fish body on a pedestal, spouting into the bay
  const MX = 1000, MY = base - 6
  const merlion = rect(MX - 26, MY - 24, 52, 24, '#7a7c94') + rect(MX - 30, MY - 28, 60, 6, '#9a9cb0') +
    // fish body rising from a curled tail, scales hinted by a lighter stripe
    profile(MX - 6, MY - 96, 70, t => 7 + Math.sin(t * Math.PI * 0.9) * 13, '#e8ecf4') +
    strokes(`M${MX - 10} ${MY - 86}q-4 30 4 56`, '#ffffff', 2, ' opacity=".7"') +
    `<path d="M${MX - 18} ${MY - 30}q-22 -6 -18 -26q10 8 22 12z" fill="#dfe4ee"/>` +
    // the lion head: a mane, the face, an ear, the open mouth
    disc(MX - 2, MY - 108, 22, '#cfd4e0') + disc(MX + 4, MY - 106, 15, '#f6f8fc') +
    rect(MX - 14, MY - 128, 8, 8, '#cfd4e0') + rect(MX + 10, MY - 110, 4, 3, '#2a2a40') +
    rect(MX + 14, MY - 100, 8, 5, '#3a3a50') +
    `<path d="M${MX + 20} ${MY - 98}q60 -10 112 62" fill="none" stroke="#cfe8ff" stroke-width="5" opacity=".75" class="gl"/>`
  const promenade = rect(200, base - 4, 1200, 8, '#3a3a50')
  return {
    sky: ['#0e1430', '#22305e', '#5a3e7a', '#d0708a'],
    scene: water(base, 60, '#2a2a52', '#121428', '#ffd8a8') + flyer + trees + mbs + promenade + merlion,
    ground: ['#2a2a3a', '#14141e'],
    sign: 'lightbox',
  }
}

const CITIES = [bangkok(), tokyo(), paris(), london(), newYork(), sanFrancisco(), singapore()]
export const CITY_COUNT = CITIES.length

// ---- the LeWell sign, dressed like that city's own street signs ----
// Every sign keeps a light face so the green wordmark and Lewy icon read.
export function citySign(kind: SignKind, x: number, foot: number): string {
  const k = 0.3, bw = (STICKER_W + 40) * k, bh = (STICKER_H + 16) * k
  const bx = x - bw / 2, by = foot - 92
  const face = (fill: string) => `<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" rx="3" fill="${fill}"/>` +
    `<g transform="translate(${f1(bx + 6)} ${f1(by + 2.5)}) scale(${k})">${sticker()}</g>`
  const frame = (fill: string, pad: number, rx = 4) => `<rect x="${f1(bx - pad)}" y="${f1(by - pad)}" width="${f1(bw + 2 * pad)}" height="${f1(bh + 2 * pad)}" rx="${rx}" fill="${fill}"/>`
  const post = (fill: string, w = 5) => `<rect x="${f1(x - w / 2)}" y="${f1(by + bh)}" width="${w}" height="${f1(foot - by - bh)}" fill="${fill}"/>`
  const glow = (colour: string, o = 0.35) => {
    const id = `sg${colour.slice(1)}`
    return `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${colour}" stop-opacity="${o * 1.6}"/><stop offset="1" stop-color="${colour}" stop-opacity="0"/></radialGradient></defs>` +
      `<ellipse cx="${f1(x)}" cy="${f1(by + bh / 2)}" rx="${f1(bw * 0.85)}" ry="${f1(bh * 1.4)}" fill="url(#${id})" class="gl"/>`
  }
  switch (kind) {
    case 'thai': // red and gold under a temple gable with curled finials
      return post('#7a1e1e') + frame('#e8b84a', 5) + frame('#a8282a', 3) + face('#f6ecd2') +
        `<path d="M${f1(bx - 8)} ${f1(by - 5)}L${f1(x)} ${f1(by - 26)}L${f1(bx + bw + 8)} ${f1(by - 5)}Z" fill="#a8282a" stroke="#e8b84a" stroke-width="2"/>` +
        `<path d="M${f1(x)} ${f1(by - 26)}q2 -10 8 -12M${f1(bx - 8)} ${f1(by - 5)}q-6 -4 -4 -10M${f1(bx + bw + 8)} ${f1(by - 5)}q6 -4 4 -10" fill="none" stroke="#e8b84a" stroke-width="2.4" stroke-linecap="round"/>`
    case 'neon': // glowing pink and cyan tubes on a dark board
      return glow('#ff5ac8', 0.22) + post('#2a2a3a') + frame('#140c24', 6, 6) + face('#fbf4fb') +
        `<rect x="${f1(bx - 4)}" y="${f1(by - 4)}" width="${f1(bw + 8)}" height="${f1(bh + 8)}" rx="5" fill="none" stroke="#ff5ac8" stroke-width="2.4" class="gl"/>` +
        `<rect x="${f1(bx - 1)}" y="${f1(by - 1)}" width="${f1(bw + 2)}" height="${f1(bh + 2)}" rx="4" fill="none" stroke="#5ae4ff" stroke-width="1.4"/>`
    case 'paris': // a café sign: dark green Art Nouveau frame, gold trim and curls
      return post('#1f4a3a', 4) + frame('#1f4a3a', 6, 8) + frame('#d8b060', 2, 5) + face('#f4ecd4') +
        `<path d="M${f1(bx - 6)} ${f1(by - 2)}q-10 -10 -2 -18q6 4 2 10M${f1(bx + bw + 6)} ${f1(by - 2)}q10 -10 2 -18q-6 4 -2 10M${f1(x - 10)} ${f1(by - 6)}q10 -12 20 0" fill="none" stroke="#d8b060" stroke-width="2" stroke-linecap="round"/>`
    case 'pub': { // hanging from an iron bracket: dark wood, gold border
      const hang = `<rect x="${f1(bx + bw + 10)}" y="${f1(by - 30)}" width="5" height="${f1(foot - by + 30)}" fill="#1c1c22"/>` +
        `<rect x="${f1(bx - 4)}" y="${f1(by - 30)}" width="${f1(bw + 19)}" height="4" fill="#1c1c22"/>` +
        `<path d="M${f1(bx + bw + 10)} ${f1(by - 26)}q-16 0 -22 14" fill="none" stroke="#1c1c22" stroke-width="2"/>` +
        `<path d="M${f1(bx + 10)} ${f1(by - 26)}V${f1(by - 6)}M${f1(bx + bw - 10)} ${f1(by - 26)}V${f1(by - 6)}" stroke="#8a8a90" stroke-width="1.6"/>`
      return glow('#ffc56a', 0.18) + hang + frame('#d8b060', 6, 3) + frame('#3a2416', 4, 3) + face('#f2e6c8')
    }
    case 'marquee': { // a Broadway marquee ringed with warm bulbs
      const pts: [number, number][] = []
      for (let t = 0; t <= 1.0001; t += 0.08) { pts.push([bx - 8 + (bw + 16) * t - 2, by - 9]); pts.push([bx - 8 + (bw + 16) * t - 2, by + bh + 5]) }
      for (let t = 0.2; t < 0.9; t += 0.3) { pts.push([bx - 9, by - 8 + (bh + 16) * t]); pts.push([bx + bw + 5, by - 8 + (bh + 16) * t]) }
      return glow('#ffd27a', 0.25) + post('#3a1a1a', 6) + frame('#7a1a1e', 9, 3) + face('#fbf2dc') +
        `<path class="li0" d="${squares(pts.filter((_, i) => i % 2 === 0), 4)}" fill="#fff0b8"/><path class="li1" d="${squares(pts.filter((_, i) => i % 2 === 1), 4)}" fill="#ffd27a"/>`
    }
    case 'victorian': // a painted-lady sign: teal frame, cornice, wooden post
      return post('#5a3a24') + frame('#2f6e6e', 6, 2) + frame('#e8c27a', 2, 2) + face('#f6efe0') +
        `<rect x="${f1(bx - 10)}" y="${f1(by - 12)}" width="${f1(bw + 20)}" height="6" fill="#2f6e6e"/><rect x="${f1(bx - 6)}" y="${f1(by - 16)}" width="${f1(bw + 12)}" height="4" fill="#e8c27a"/>`
    default: // Singapore: a sleek lightbox with a soft cool glow
      return glow('#bfe8ff', 0.28) + post('#9aa0b0', 4) + frame('#c8ccd8', 3, 6) + face('#ffffff') +
        `<rect x="${f1(bx)}" y="${f1(by + bh - 3)}" width="${f1(bw)}" height="3" fill="#5ad0ff" opacity=".8"/>`
  }
}

// the street for each city: pavement, kerb, lamps and that city's LeWell sign
const STREET_Y = 780
const lamp = (x: number) => rect(x, STREET_Y - 120, P, 120, '#3a3a4a') + rect(x - P, STREET_Y - 130, P * 3, P * 2, '#ffd98a') +
  `<circle cx="${snap(x) + 3}" cy="${STREET_Y - 124}" r="44" fill="url(#warm)" class="gl"/>`
const streetFor = (kind: SignKind) => rect(0, STREET_Y - 30, W, 30, 'url(#pavement)') + rect(0, STREET_Y, W, P * 2, '#5a5468') + rect(0, STREET_Y + P * 2, W, 200, 'url(#road)') +
  Array.from({ length: 8 }, (_, i) => rect(i * 200 + 60, STREET_Y + 60, 80, P, '#d8d2a8', ' opacity=".6"')).join('') +
  [140, 620, 1100, 1540].map(lamp).join('') + citySign(kind, 380, STREET_Y - 24)

// ---- Lewy ----
const LEWY_PX = 6.8
const LW = NL_GRID.w * LEWY_PX, LH = NL_GRID.h * LEWY_PX
const STEP_S = 1.5
const FEET = STREET_Y - 10

function lewy(walking: boolean): string {
  const body = walking ? walkPoses(NL_WALK, STEP_S) : `${NL_IDLE}<g class="blink">${NL_BLINK}</g>`
  return `<path d="M${snap(W / 2 - LW * 0.3)} ${FEET}h${snap(LW * 0.6)}v${P}h-${snap(LW * 0.6)}z" fill="#0c0b14" opacity=".55"/>` +
    `<g class="px" transform="translate(${Math.round(W / 2 - LW / 2)} ${Math.round(FEET + 4 - LH * 0.957)}) scale(${LEWY_PX}) translate(0 .5)">${body}</g>`
}

const STREET_S = 80
// Moving parts step at FPS frames a second instead of gliding at the screen's rate:
// it suits the pixel look and lets the app redraw far less often (founder, 18 Nov:
// the scenes froze while the app was busy). Same as the Christmas night.
const FPS = 12
const steps = (durS: number) => `steps(${Math.max(1, Math.round(durS * FPS))})`
const ZOOM = { x: 200, y: 225, w: 1200, h: 675 }

const DRIFT = 180
// a single city pans its landmarks slowly back and forth instead, PAN_S seconds each way
const PAN_S = 60

/** The single cities, in tour order; each is its own scene too. */
export const CITY_IDS = ['bangkok', 'tokyo', 'paris', 'london', 'newyork', 'sanfrancisco', 'singapore'] as const
export type CityId = (typeof CITY_IDS)[number]
export const CITY_NAMES: Record<CityId, string> = {
  bangkok: 'Bangkok', tokyo: 'Tokyo', paris: 'Paris', london: 'London',
  newyork: 'New York', sanfrancisco: 'San Francisco', singapore: 'Singapore',
}

/** The tour at `walkedMs` of walking: the city is chosen by walking time. */
export function lewellCitiesScene(walking: boolean, walkedMs: number): string {
  return drawCity(walking, walkedMs, null)
}

/** One city, Lewy walking its street for good. */
export function lewellCityScene(id: CityId): (walking: boolean, walkedMs: number) => string {
  return (walking, walkedMs) => drawCity(walking, walkedMs, CITY_IDS.indexOf(id))
}

function drawCity(walking: boolean, walkedMs: number, only: number | null): string {
  const t = walkedMs / 1000
  const c = (only === null ? CITIES[Math.floor(t / CITY_S) % CITIES.length] : CITIES[only]) ?? CITIES[0]!
  const off = -((t / STREET_S) * W) % W
  const anim = walking ? ` style="animation:scroll ${STREET_S}s ${steps(STREET_S)} -${f1(t % STREET_S)}s infinite"` : ` transform="translate(${Math.round(off)} 0)"`
  const street = `<g${anim}><g id="street">${streetFor(c.sign)}</g><use href="#street" x="${W}"/></g>`
  // the landmarks drift slowly left behind the street (parallax), DRIFT px each way over one city
  const inCity = t % CITY_S
  const driftAt = DRIFT - (inCity / CITY_S) * 2 * DRIFT
  const inPan = t % (2 * PAN_S), panAt = inPan < PAN_S ? DRIFT - (inPan / PAN_S) * 2 * DRIFT : -DRIFT + ((inPan - PAN_S) / PAN_S) * 2 * DRIFT
  const landmarks = only === null
    ? (walking
      ? `<g style="animation:drift ${CITY_S}s ${steps(CITY_S)} -${f1(inCity)}s 1 forwards">${c.scene}</g>`
      : `<g transform="translate(${Math.round(driftAt)} 0)">${c.scene}</g>`)
    : (walking
      ? `<g style="animation:drift ${PAN_S}s ${steps(PAN_S)} -${f1(inPan)}s infinite alternate">${c.scene}</g>`
      : `<g transform="translate(${Math.round(panAt)} 0)">${c.scene}</g>`)
  reseed(7)
  // stars in three groups, each twinkling on its own beat, so they never blink together
  const sd = ['', '', '']
  for (let i = 0; i < 34; i++) sd[i % 3] += `M${snap(220 + rand() * 1160)} ${snap(236 + rand() * 200)}h${P}v${P}h-${P}z`
  const style = `
.px path{fill:none;stroke-width:1.04}
.st0{animation:tw 3.1s ${steps(3.1)} infinite}.st1{animation:tw 4.3s ${steps(4.3)} -1.7s infinite}.st2{animation:tw 5.9s ${steps(5.9)} -3.2s infinite}
@keyframes tw{0%,100%{opacity:.8}50%{opacity:.15}}
.blink{visibility:hidden;animation:blink 4.2s step-end infinite}
@keyframes drift{from{transform:translateX(${DRIFT}px)}to{transform:translateX(-${DRIFT}px)}}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-${W}px)}}
${walkPosesCss(NL_WALK.length, STEP_S)}
@keyframes blink{0%{visibility:hidden}95%{visibility:visible}98.5%{visibility:hidden}}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ZOOM.x} ${ZOOM.y} ${ZOOM.w} ${ZOOM.h}" width="100%" height="100%" preserveAspectRatio="xMidYMax slice"><style>${style}</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stop-color="${c.sky[0]}"/><stop offset=".45" stop-color="${c.sky[1]}"/><stop offset=".62" stop-color="${c.sky[2]}"/><stop offset=".76" stop-color="${c.sky[3]}"/></linearGradient>
<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffc56a" stop-opacity=".55"/><stop offset="1" stop-color="#ffc56a" stop-opacity="0"/></radialGradient>
<radialGradient id="beam" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c0" stop-opacity=".9"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient>
<linearGradient id="arun" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f0d4ae"/><stop offset=".5" stop-color="#cc9e7c"/><stop offset="1" stop-color="#8a6252"/></linearGradient>
<linearGradient id="tokyo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff8a5a"/><stop offset="1" stop-color="#c8361e"/></linearGradient>
<linearGradient id="fuji" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e5e90"/><stop offset="1" stop-color="#2a2c5a"/></linearGradient>
<linearGradient id="eiffel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f2c272"/><stop offset="1" stop-color="#9a6430"/></linearGradient>
<linearGradient id="stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c4ac7a"/><stop offset="1" stop-color="#6a5a40"/></linearGradient>
<linearGradient id="roof" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a7e7e"/><stop offset="1" stop-color="#2a3638"/></linearGradient>
<linearGradient id="deco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9c9cba"/><stop offset="1" stop-color="#3e3e5c"/></linearGradient>
<linearGradient id="gg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2502a"/><stop offset="1" stop-color="#9a2e18"/></linearGradient>
<linearGradient id="honey" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2c48a"/><stop offset="1" stop-color="#8a6c44"/></linearGradient>
<linearGradient id="mbs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a8098"/><stop offset=".5" stop-color="#4a5068"/><stop offset="1" stop-color="#2a2e44"/></linearGradient>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a4a7a"/><stop offset="1" stop-color="#2e2240"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#b8862a"/></linearGradient>
<linearGradient id="skytree" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8eef8"/><stop offset="1" stop-color="#8a98b8"/></linearGradient>
<linearGradient id="verdigris" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fd0b4"/><stop offset="1" stop-color="#3e7a62"/></linearGradient>
<linearGradient id="lead" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa6b8"/><stop offset="1" stop-color="#4a5468"/></linearGradient>
<linearGradient id="pavement" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.ground[0]}"/><stop offset="1" stop-color="${c.ground[1]}"/></linearGradient>
<linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1a26"/><stop offset="1" stop-color="#0e0d14"/></linearGradient>
</defs>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#sky)"/>${sd.map((d, i) => `<path class="st${i}" d="${d}" fill="#e6e4ff" opacity=".7"/>`).join('')}
${landmarks}
${street}
${lewy(walking)}
</svg>`
}
