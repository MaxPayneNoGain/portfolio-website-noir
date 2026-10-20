"use client"

import { type RefObject, useEffect, useRef, useState } from "react"
import { onTick } from "@/lib/clock"
import { NOW } from "@/lib/content"
import { drawStreak, SLANT, streak } from "@/lib/streak"
import { Headlights } from "./night"
import "./hero.css"

const rand = (min: number, max: number) => min + Math.random() * (max - min)

const DEPTHS = 4
const SHADES = 8

function Rain({ bulb }: { bulb: RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let width = 0
    let height = 0
    let lampX = 0
    let lampY = 0
    let stop = () => {}

    // z is depth
    const drops = Array.from({ length: 380 }, () => {
      const z = Math.random() ** 1.4
      return { x: Math.random() * 1.1, y: Math.random(), z, depth: Math.min(DEPTHS - 1, Math.floor(z * DEPTHS)) }
    })

    // one streak per depth and lamp shade, warmer and brighter near the lamp
    const streaks = Array.from({ length: DEPTHS * SHADES }, (_, i) => {
      const z = (Math.floor(i / SHADES) + 0.5) / DEPTHS
      const k = (i % SHADES) / (SHADES - 1)
      const alpha = 0.1 + z * 0.18 + k * (0.3 + z * 0.35)
      const r = 170 + k * 85
      const g = 185 - k * 10
      const b = 210 - k * 165
      return streak(10 + z * 34, 0.6 + z * 1.2, `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`)
    })

    const lampLight = (x: number, y: number) => {
      const dx = (x - lampX) / 480
      const dy = (y - lampY - 120) / 460
      return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy))
    }

    const resize = () => {
      // thin moving streaks look the same at 1x
      width = canvas.width = canvas.clientWidth
      height = canvas.height = canvas.clientHeight

      const box = canvas.getBoundingClientRect()
      const b = bulb.current?.getBoundingClientRect()
      lampX = b ? b.left - box.left : width * 0.85
      lampY = b ? b.top - box.top : 0
    }

    let last = performance.now()

    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 16.7
      last = now
      ctx.clearRect(0, 0, width, height)

      for (const d of drops) {
        const len = 10 + d.z * 34
        const speed = 7 + d.z * 15
        const x = d.x * width
        const y = d.y * height
        const shade = Math.round(lampLight(x, y) * (SHADES - 1))
        drawStreak(ctx, streaks[d.depth * SHADES + shade], x, y, len)

        d.y += (speed * dt) / height
        d.x -= (speed * SLANT * dt) / width
        if (d.y > 1.05) {
          d.y = -0.05
          d.x = Math.random() * 1.15
        }
      }
    }

    // only animate while the landing section is on screen
    const watch = new IntersectionObserver((entries) => {
      stop()
      if (!entries[entries.length - 1].isIntersecting) return
      last = performance.now()
      stop = onTick(draw)
    })

    resize()
    watch.observe(canvas)
    window.addEventListener("resize", resize)
    return () => {
      watch.disconnect()
      stop()
      window.removeEventListener("resize", resize)
    }
  }, [bulb])

  return <canvas ref={ref} className="r-rain" aria-hidden="true" />
}

function Lamp({ bulb }: { bulb: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="r-lamp" aria-hidden="true">
      <div ref={bulb} className="r-lamp__light">
        <span className="r-moth" />
        <span className="r-moth" />
        <span className="r-moth" />
        <span className="r-moth" />
      </div>
    </div>
  )
}

function Lightning() {
  const [flash, setFlash] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer: ReturnType<typeof setTimeout>
    const next = () => {
      timer = setTimeout(() => {
        setFlash((f) => f + 1)
        next()
      }, rand(30000, 60000))
    }
    next()
    return () => clearTimeout(timer)
  }, [])

  return flash ? <div key={flash} className="r-lightning" aria-hidden="true" /> : null
}

function useNeonFlicker(sign: RefObject<HTMLHeadingElement | null>) {
  useEffect(() => {
    const el = sign.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const chars = Array.from(el.querySelectorAll<HTMLElement>(".r-neon__char"))
    const timers: ReturnType<typeof setTimeout>[] = []
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms))

    const stutter = (target: HTMLElement, done: () => void) => {
      let t = 0
      const flips = 2 + Math.floor(Math.random() * 6)
      for (let i = 0; i < flips; i++) {
        const state = Math.random() < 0.7 ? "is-off" : "is-dim"
        later(() => target.classList.add(state), t)
        t += rand(30, 120)
        later(() => target.classList.remove(state), t)
        t += rand(40, 220)
      }
      later(done, t)
    }

    const next = () => {
      later(() => {
        const whole = Math.random() < 0.25
        const target = whole ? el : chars[Math.floor(Math.random() * chars.length)]
        stutter(target, next)
      }, rand(1500, 6500))
    }

    next()
    return () => timers.forEach(clearTimeout)
  }, [sign])
}

function NeonWord({ word, tone }: { word: string; tone: "red" | "blue" }) {
  return (
    <span className={`r-neon__line r-neon__line--${tone}`} aria-hidden="true">
      {word.split("").map((char, i) => (
        <span key={i} className="r-neon__char">
          {char}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const sign = useRef<HTMLHeadingElement>(null)
  const bulb = useRef<HTMLDivElement>(null)
  useNeonFlicker(sign)

  return (
    <header id="intro" className="r-hero">
      <Lamp bulb={bulb} />
      <div className="r-fog" aria-hidden="true">
        <div className="r-fog__layer">
          <span />
        </div>
        <div className="r-fog__layer">
          <span />
        </div>
        <div className="r-fog__lit">
          <span />
        </div>
      </div>
      <Rain bulb={bulb} />
      <Headlights />
      <Lightning />
      <div className="r-wrap r-hero__grid">
        <div>
          <h1 ref={sign} id="name" className="r-neon" aria-label="Nick Sharma" tabIndex={-1}>
            <NeonWord word="NICK" tone="red" />
            <NeonWord word="SHARMA" tone="blue" />
          </h1>
          <p className="r-tagline">
            Software developer <i>·</i> CS @ Southern Miss
          </p>
          <p className="r-lede">
            I write code, but I'm always thinking a step past it: who's using this, what they need, and whether it's
            worth building. And that's usually where my best ideas show up.
          </p>
          <div className="r-openrow">
            <span className="r-open">OPEN</span>
            <span>to opportunities.</span>
          </div>
        </div>

        <aside className="r-hero__side">
          <div className="r-now">
            <div className="r-now__head">LAST KNOWN WHEREABOUTS</div>
            <a href={NOW.href} target="_blank" rel="noopener noreferrer" className="r-now__link">
              {NOW.role}
            </a>
            <div>@ {NOW.org}</div>
            <div className="r-now__date">{NOW.dates}</div>
          </div>
        </aside>
      </div>
    </header>
  )
}
