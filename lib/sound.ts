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

// a metal ring that dies fast
function ring(ac: AudioContext, at: number, freq: number, gain: number, decay: number) {
  const osc = ac.createOscillator()
  osc.frequency.value = freq
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, at)
  env.gain.exponentialRampToValueAtTime(0.001, at + decay)
  osc.connect(env).connect(out)
  osc.start(at)
  osc.stop(at + decay)
}

// one 8-bit note
function chip(ac: AudioContext, at: number, freq: number, gain: number, length: number) {
  const osc = ac.createOscillator()
  osc.type = "square"
  osc.frequency.value = freq
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, at)
  env.gain.setValueAtTime(gain, at + length * 0.6)
  env.gain.exponentialRampToValueAtTime(0.001, at + length)
  osc.connect(env).connect(out)
  osc.start(at)
  osc.stop(at + length)
}

// the quarter clinking into the slot, then the machine's credit chime
export function coin() {
  if (!ctx) return
  const ac = ctx
  const t = ac.currentTime
  burst(ac, t, 6000, 2, 0.3, 0.02)
  ring(ac, t, 2780, 0.12, 0.25)
  ring(ac, t, 4170, 0.07, 0.18)
  burst(ac, t + 0.07, 5200, 2, 0.15, 0.02)
  ring(ac, t + 0.07, 3310, 0.06, 0.15)

  chip(ac, t + 0.2, 988, 0.06, 0.08)
  chip(ac, t + 0.28, 1319, 0.06, 0.4)
}

// menu cursor: a quick square chirp up
export function blip() {
  if (!ctx) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = "square"
  osc.frequency.setValueAtTime(620, t)
  osc.frequency.exponentialRampToValueAtTime(1240, t + 0.04)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.05, t)
  env.gain.setValueAtTime(0.05, t + 0.04)
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
  osc.connect(env).connect(out)
  osc.start(t)
  osc.stop(t + 0.07)
}

// where the jazz picks up the first time, in seconds. after that it loops from the top
const JAZZ_FROM = 90

let ambience = false

// a looping recording, faded in from silence
function track(ac: AudioContext, src: string, level: number, from = 0) {
  const audio = new Audio(src)
  audio.loop = true
  if (from) audio.addEventListener("loadedmetadata", () => (audio.currentTime = from), { once: true })
  const gain = ac.createGain()
  gain.gain.setValueAtTime(0, ac.currentTime)
  gain.gain.linearRampToValueAtTime(level, ac.currentTime + 4)
  ac.createMediaElementSource(audio).connect(gain).connect(out)
  audio.play().catch(() => {})
}

// the bar's jazz with light rain outside, faded in once the tape is playing
export function startAmbience() {
  if (!ctx || ambience) return
  ambience = true
  const ac = ctx
  track(ac, "/audio/night-jazz.mp3", 0.35, JAZZ_FROM)
  track(ac, "/audio/light-rain.mp3", 0.15)

  // nothing plays in a background tab
  document.addEventListener("visibilitychange", () => (document.hidden ? ac.suspend() : ac.resume()))
}
