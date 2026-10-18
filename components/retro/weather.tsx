"use client"

import { useEffect, useRef } from "react"
import "./weather.css"

export function Weather() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let width = 0
    let height = 0
    let frame = 0
    let last = performance.now()

    const drops = Array.from({ length: 140 }, () => ({
      x: Math.random() * 1.1,
      y: Math.random(),
      z: Math.random() ** 1.5,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 16.7
      last = now
      ctx.clearRect(0, 0, width, height)

      for (const d of drops) {
        const len = 8 + d.z * 26
        const speed = 6 + d.z * 12
        const x = d.x * width
        const y = d.y * height
        ctx.strokeStyle = `rgba(175, 190, 215, ${0.05 + d.z * 0.12})`
        ctx.lineWidth = 0.5 + d.z
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
  }, [])

  return (
    <div className="r-weather" aria-hidden="true">
      <span className="r-weather__fog" />
      <span className="r-weather__fog" />
      <canvas ref={ref} />
    </div>
  )
}
