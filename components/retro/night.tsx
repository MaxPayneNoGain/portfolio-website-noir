"use client"

import { useEffect, useState } from "react"
import "./night.css"

const rand = (min: number, max: number) => min + Math.random() * (max - min)

export function Headlights() {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer: ReturnType<typeof setTimeout>
    const next = () => {
      timer = setTimeout(() => {
        if (!document.hidden) setN((v) => v + 1)
        next()
      }, rand(12000, 22000))
    }
    next()
    return () => clearTimeout(timer)
  }, [])

  return n ? (
    <div key={n} className={`r-car${n % 2 ? " is-reverse" : ""}`} aria-hidden="true">
      <div className="r-car__beam" />
    </div>
  ) : null
}
