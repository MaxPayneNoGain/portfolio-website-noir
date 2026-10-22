"use client"

import { useEffect, useRef } from "react"
import { onTick } from "@/lib/clock"
import { drawStreak, SLANT, streak } from "@/lib/streak"
import "./weather.css"

const LEVELS = 4

export function Weather() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return

    let width = 0
    let height = 0
    let last = performance.now()

    const drops = Array.from({ length: 140 }, () => ({
      x: Math.random() * 1.1,
      y: Math.random(),
      z: Math.random() ** 1.5,
    }))

    // one streak per depth level
    const streaks = Array.from({ length: LEVELS }, (_, l) => {
      const z = (l + 0.5) / LEVELS
      return streak(8 + z * 26, 0.5 + z, `rgba(175, 190, 215, ${0.05 + z * 0.12})`)
    })

    const resize = () => {
      // faint enough that retina resolution doesn't show, and it's a quarter of the pixels
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 16.7
      last = now
      ctx.clearRect(0, 0, width, height)

      for (const d of drops) {
        const len = 8 + d.z * 26
        const speed = 6 + d.z * 12
        drawStreak(ctx, streaks[Math.min(LEVELS - 1, Math.floor(d.z * LEVELS))], d.x * width, d.y * height, len)

        d.y += (speed * dt) / height
        d.x -= (speed * SLANT * dt) / width
        if (d.y > 1.05) {
          d.y = -0.05
          d.x = Math.random() * 1.15
        }
      }
    }

    resize()
    const stop = onTick(draw)
    window.addEventListener("resize", resize)
    return () => {
      stop()
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="r-weather" aria-hidden="true">
      <div className="r-weather__fog">
        <span />
      </div>
      <div className="r-weather__fog">
        <span />
      </div>
      <canvas ref={ref} />
    </div>
  )
}
