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
