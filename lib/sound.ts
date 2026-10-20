// every sound is made here in code, on one audio context opened by the first click or key

let ctx: AudioContext | null = null
let out: GainNode
let noise: AudioBuffer

export function unlock() {
  if (!ctx) {
    ctx = new AudioContext()
    out = ctx.createGain()
    out.gain.value = 0.6
    out.connect(ctx.destination)

    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  if (ctx.state === "suspended") ctx.resume()
}

// a filtered tick of noise, the click part of a key
function burst(ac: AudioContext, at: number, freq: number, q: number, gain: number, decay: number) {
  const src = ac.createBufferSource()
  src.buffer = noise
  const filter = ac.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = freq
  filter.Q.value = q
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, at)
  env.gain.exponentialRampToValueAtTime(0.001, at + decay)
  src.connect(filter).connect(env).connect(out)
  src.start(at, Math.random() * 0.8, decay)
}

// a low knock that drops in pitch, the key bottoming out
function thump(ac: AudioContext, at: number, freq: number, gain: number, decay: number) {
  const osc = ac.createOscillator()
  osc.frequency.setValueAtTime(freq, at)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, at + decay)
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, at)
  env.gain.exponentialRampToValueAtTime(0.001, at + decay)
  osc.connect(env).connect(out)
  osc.start(at)
  osc.stop(at + decay)
}

export function keyClick() {
  if (!ctx) return
  const t = ctx.currentTime
  const r = 0.85 + Math.random() * 0.3
  burst(ctx, t, 3200 * r, 1.2, 0.45, 0.025)
  thump(ctx, t, 190 * r, 0.22, 0.04)
  // the key coming back up
  burst(ctx, t + 0.05 + Math.random() * 0.025, 2500 * r, 1.5, 0.12, 0.02)
}

export function enterKey() {
  if (!ctx) return
  const t = ctx.currentTime
  burst(ctx, t, 1900, 0.9, 0.7, 0.06)
  thump(ctx, t, 120, 0.45, 0.09)
  burst(ctx, t + 0.11, 1500, 1.2, 0.2, 0.03)
}

// tv snow: hiss with a faint mains hum under it, plays until stopped
export function tvStatic() {
  if (!ctx) return () => {}
  const ac = ctx
  const t = ac.currentTime

  const hiss = ac.createBufferSource()
  hiss.buffer = noise
  hiss.loop = true
  const high = ac.createBiquadFilter()
  high.type = "highpass"
  high.frequency.value = 500
  const low = ac.createBiquadFilter()
  low.type = "lowpass"
  low.frequency.value = 5000

  const hum = ac.createOscillator()
  hum.type = "sawtooth"
  hum.frequency.value = 60
  const humLevel = ac.createGain()
  humLevel.gain.value = 0.06

  const env = ac.createGain()
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(0.12, t + 0.03)

  hiss.connect(high).connect(low).connect(env)
  hum.connect(humLevel).connect(env)
  env.connect(out)
  hiss.start(t)
  hum.start(t)

  return () => {
    const end = ac.currentTime
    env.gain.cancelScheduledValues(end)
    env.gain.setValueAtTime(env.gain.value, end)
    env.gain.linearRampToValueAtTime(0, end + 0.05)
    hiss.stop(end + 0.06)
    hum.stop(end + 0.06)
  }
}

// the crt coming on: a soft knock, then a whoosh and tone sweeping up
export function crtOn() {
  if (!ctx) return
  const ac = ctx
  const t = ac.currentTime
  thump(ac, t, 90, 0.3, 0.12)

  const tone = ac.createOscillator()
  tone.type = "triangle"
  tone.frequency.setValueAtTime(180, t)
  tone.frequency.exponentialRampToValueAtTime(1400, t + 0.3)
  const toneEnv = ac.createGain()
  toneEnv.gain.setValueAtTime(0, t)
  toneEnv.gain.linearRampToValueAtTime(0.08, t + 0.05)
  toneEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  tone.connect(toneEnv).connect(out)
  tone.start(t)
  tone.stop(t + 0.4)

  const whoosh = ac.createBufferSource()
  whoosh.buffer = noise
  const band = ac.createBiquadFilter()
  band.type = "bandpass"
  band.Q.value = 2
  band.frequency.setValueAtTime(400, t)
  band.frequency.exponentialRampToValueAtTime(4000, t + 0.3)
  const whooshEnv = ac.createGain()
  whooshEnv.gain.setValueAtTime(0, t)
  whooshEnv.gain.linearRampToValueAtTime(0.12, t + 0.06)
  whooshEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
  whoosh.connect(band).connect(whooshEnv).connect(out)
  whoosh.start(t, Math.random() * 0.5, 0.35)
}

// where the jazz picks up the first time, in seconds. after that it loops from the top
const JAZZ_FROM = 90

let ambience = false

// the bar's jazz, faded in once the tape is playing
export function startAmbience() {
  if (!ctx || ambience) return
  ambience = true
  const ac = ctx
  const t = ac.currentTime

  const jazz = new Audio("/audio/night-jazz.mp3")
  jazz.loop = true
  jazz.addEventListener("loadedmetadata", () => (jazz.currentTime = JAZZ_FROM), { once: true })
  const jazzLevel = ac.createGain()
  jazzLevel.gain.setValueAtTime(0, t)
  jazzLevel.gain.linearRampToValueAtTime(0.35, t + 4)
  ac.createMediaElementSource(jazz).connect(jazzLevel).connect(out)
  jazz.play().catch(() => {})

  // nothing plays in a background tab
  document.addEventListener("visibilitychange", () => (document.hidden ? ac.suspend() : ac.resume()))
}
