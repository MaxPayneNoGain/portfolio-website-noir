"use client"

import { type RefObject, useEffect, useRef } from "react"
import { NOW } from "@/lib/content"
import "./hero.css"

const rand = (min: number, max: number) => min + Math.random() * (max - min)

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
    let frame = 0

    // z is depth
    const drops = Array.from({ length: 380 }, () => ({
      x: Math.random() * 1.1,
      y: Math.random(),
      z: Math.random() ** 1.4,
    }))

    const lampLight = (x: number, y: number) => {
      const dx = (x - lampX) / 480
      const dy = (y - lampY - 120) / 460
      return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const box = canvas.getBoundingClientRect()
      const b = bulb.current?.getBoundingClientRect()
      lampX = b ? b.left - box.left : width * 0.85
      lampY = b ? b.top - box.top : 0
    }

    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 16.7
      last = now
      ctx.clearRect(0, 0, width, height)

      for (const d of drops) {
        const len = 10 + d.z * 34
        const speed = 7 + d.z * 15
        const x = d.x * width
        const y = d.y * height
        const k = lampLight(x, y)

        const alpha = 0.1 + d.z * 0.18 + k * (0.3 + d.z * 0.35)
        const r = 170 + k * 85
        const g = 185 - k * 10
        const b = 210 - k * 165
        ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`
        ctx.lineWidth = 0.6 + d.z * 1.2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - len * 0.12, y + len)
        ctx.stroke()

        d.y += (speed * dt) / height
        d.x -= (speed * 0.12 * dt) / width
        if (d.y > 1.05) {
          d.y = -0.05
          d.x = Math.random() * 1.15
        }
      }

      frame = requestAnimationFrame(tick)
    }

    resize()
    frame = requestAnimationFrame(tick)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [bulb])

  return <canvas ref={ref} className="r-rain" aria-hidden="true" />
}

function Lamp({ bulb }: { bulb: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="r-lamp" aria-hidden="true">
      <div ref={bulb} className="r-lamp__light" />
    </div>
  )
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
        <span />
        <span />
        <span className="r-fog__lit" />
      </div>
      <Rain bulb={bulb} />
      <div className="r-wrap r-hero__grid">
        <div>
          <h1 ref={sign} className="r-neon" aria-label="Nick Sharma">
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
