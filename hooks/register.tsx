import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import type { LewyClock } from '../types'
import { CITY_IDS, CITY_NAMES, CITY_S, lewellCitiesScene, lewellCityScene } from './lewell-cities'
import type { CityId } from './lewell-cities'
import { lewellXmasNightScene } from './lewell-xmas-night'

// LeWell backdrops for the Claude desktop app: Lewy walks while Claude works and
// stands (and blinks) when it waits for you. Scenes: a Christmas night village, a
// city tour, and each city alone; /scene switches between them.
//
// What the desktop backdrop needs, learned 15-16 Nov:
// - only code-drawn SVG shows (no pictures); one flat <svg>, <style> first
// - CSS keyframes play, but only while the drawing stays light: few large shapes,
//   no thousands of tiny strokes, no clip or CSS-moved groups on top
// - the backdrop redraws only when the scene's name changes, so a state change
//   (walk/stand) sets the theme again under a flipped name (scene_a / scene_b)
// - only the desktop app draws backdrops; terminal, VS Code and phone do not

// the city tour rotates through every city; each city is also a scene of its own
type SceneId = 'lewell-xmas-night' | 'lewell-city-tour' | `lewell-${CityId}`
const SCENES: SceneId[] = ['lewell-xmas-night', 'lewell-city-tour', ...CITY_IDS.map(id => `lewell-${id}` as const)]
const isScene = (v: unknown): v is SceneId => SCENES.includes(v as SceneId)

const GLASS = { blur: 12, tint: '#141826', opacity: 0.5 }
// stepS: a scene that changes as Lewy walks (a new city every stepS seconds) is redrawn at each change
type Look = { look: ThemeSetArgs; draw: (walking: boolean, walkedMs: number) => string; alt: string; stepS?: number }
const cityLook = (id: CityId): Look => ({
  look: { backdrop: { scene: `lewell-${id}`, glass: GLASS } },
  draw: lewellCityScene(id),
  alt: `A little companion walks an evening street in ${CITY_NAMES[id]} past its landmarks while Claude works, and stands when Claude needs you`,
})
const LOOKS: Record<SceneId, Look> = {
  ...(Object.fromEntries(CITY_IDS.map(id => [`lewell-${id}`, cityLook(id)])) as Record<`lewell-${CityId}`, Look>),
  'lewell-xmas-night': {
    look: { backdrop: { scene: 'lewell-xmas-night', glass: GLASS } },
    draw: lewellXmasNightScene,
    alt: 'A little companion walks a moonlit snowy path past Christmas lights and lit cottages while Claude works, and stands when Claude needs you',
  },
  'lewell-city-tour': {
    look: { backdrop: { scene: 'lewell-city-tour', glass: GLASS } },
    draw: lewellCitiesScene,
    stepS: CITY_S,
    alt: 'A little companion walks past Wat Arun, Tokyo Tower, the Eiffel Tower, Big Ben, the Empire State, the Golden Gate and Marina Bay while Claude works, and stands when Claude needs you',
  },
}

// Lewy's clock: walking time adds up across turns, so the scene carries on from
// where he stopped instead of starting over.
const lewy = atom({ plugin: 'lewell-theme', key: 'lewy' } as const, { isWalking: false, offsetMs: 0, sinceMs: 0 }, { shape: 'lewy-1' })
let isTurnActive = false
let currentScene: SceneId = 'lewell-xmas-night'
let sceneFlip = false

async function redraw($: EngineInterface): Promise<void> {
  sceneFlip = !sceneFlip
  await $.theme.set({ backdrop: { scene: `${currentScene}_${sceneFlip ? 'a' : 'b'}`, glass: GLASS } }).catch(() => undefined)
}

async function walk($: EngineInterface, isWalking: boolean): Promise<void> {
  // already in that state (every tool call asks again): touch nothing, so the
  // backdrop is not re-checked mid-walk
  if ((await read($, lewy)).isWalking === isWalking) return
  const now = await $.clock.now()
  let changed = false
  await update($, lewy, (c: LewyClock): LewyClock => {
    if (c.isWalking === isWalking) return c
    changed = true
    return isWalking
      ? { isWalking: true, offsetMs: c.offsetMs, sinceMs: now }
      : { isWalking: false, offsetMs: c.offsetMs + Math.max(0, now - c.sinceMs), sinceMs: now }
  })
  if (changed) await redraw($)
  if (changed) await scheduleStep($)
}

// Scenes that change as Lewy walks: redraw at each change while he walks. The
// drawing is chosen from walked time stepped to the change, so it stays the same
// between changes (repeated asks return the same drawing).
let stepTimer: { cancel: () => void } | null = null
async function scheduleStep($: EngineInterface): Promise<void> {
  stepTimer?.cancel(); stepTimer = null
  const stepS = LOOKS[currentScene].stepS
  const c = await read($, lewy)
  if (!stepS || !c.isWalking) return
  const ms = c.offsetMs + Math.max(0, (await $.clock.now()) - c.sinceMs)
  const wait = stepS * 1000 - (ms % (stepS * 1000)) + 40
  stepTimer = $.clock.after(wait, () => { void redraw($).then(() => scheduleStep($)) })
}

function walkedForDrawing(c: LewyClock, now: number): number {
  const stepS = LOOKS[currentScene].stepS
  if (!stepS || !c.isWalking) return c.offsetMs
  const walked = c.offsetMs + Math.max(0, now - c.sinceMs)
  return Math.max(c.offsetMs, Math.floor(walked / (stepS * 1000)) * stepS * 1000)
}

async function apply($: EngineInterface, id: SceneId): Promise<void> {
  currentScene = id
  // where nothing can draw a backdrop (terminal, VS Code) stay quiet
  await $.theme.set(LOOKS[id].look).catch(() => undefined)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'scene', description: `Switch the backdrop: /scene ${SCENES.join(', ')}` })
    // 16 Nov: the tour was renamed from lewell-cities to lewell-city-tour
    if ((await $.store.get('scene')) === 'lewell-cities') await $.store.set('scene', 'lewell-city-tour')
    const saved = await $.store.get('scene')
    await apply($, isScene(saved) ? saved : 'lewell-xmas-night')
    return next(e)
  })

  on('command.run', { command: 'scene' }, async ($, e) => {
    const id = e.args.trim().toLowerCase()
    if (!isScene(id)) return { text: `Scenes: ${SCENES.join(', ')}` }
    await $.store.set('scene', id)
    await apply($, id)
    return { text: `Backdrop: ${id}` }
  })

  // Working: walk. Done, or waiting on you: stand.
  on('turn.start', async ($, e, next) => {
    isTurnActive = true
    await walk($, true)
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    isTurnActive = false
    await walk($, false)
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.tool === 'AskUserQuestion' || e.tool === 'ExitPlanMode') await walk($, false)
    const result = await next(e)
    if (isTurnActive) await walk($, true)
    return result
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    const named = e.props.scene.replace(/_[ab]$/, '')
    if (e.props.plugin !== 'lewell-theme' || !isScene(named)) return next(e)
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    const { Svg } = $.ui.resolve(e)
    const c = await read($, lewy)
    // walked time held steady between changes: repeated asks return the same drawing
    return <Svg source={LOOKS[named].draw(c.isWalking, walkedForDrawing(c, await $.clock.now()))} alt={LOOKS[named].alt} isInteractive />
  })
}
