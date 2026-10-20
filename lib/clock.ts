// everything that moves nonstop shares one 30fps clock, like tape,
// so the screen redraws 30 times a second instead of on every refresh

const FRAME = 1000 / 30

type Tick = (now: number) => void

// left at full frame rate
const SMOOTH = new Set(["r-moth", "jb-bubbles"])

const ticks = new Set<Tick>()
const starts = new WeakMap<Animation, number>()
let frame = 0
let lastSlot = 0

// css animations would keep the browser drawing at full rate, so they get paused and stepped here too
function stepAnimations(now: number) {
  for (const a of document.getAnimations()) {
    if (!(a instanceof CSSAnimation) || a.playState === "finished" || SMOOTH.has(a.animationName)) continue
    let start = starts.get(a)
    if (start === undefined) {
      if (a.startTime === null) continue
      start = Number(a.startTime)
      starts.set(a, start)
      a.pause()
    }
    const t = now - start
    if (t >= Number(a.effect?.getComputedTiming().endTime)) a.finish()
    else a.currentTime = t
  }
}

function loop(now: number) {
  frame = requestAnimationFrame(loop)
  const slot = Math.floor(now / FRAME)
  if (slot === lastSlot) return
  lastSlot = slot
  stepAnimations(now)
  ticks.forEach((tick) => tick(now))
}

export function onTick(tick: Tick) {
  ticks.add(tick)
  if (ticks.size === 1) frame = requestAnimationFrame(loop)

  return () => {
    if (!ticks.delete(tick) || ticks.size) return
    cancelAnimationFrame(frame)
    // hand the animations back to the browser
    for (const a of document.getAnimations()) {
      if (starts.has(a) && a.playState === "paused") a.play()
    }
  }
}
