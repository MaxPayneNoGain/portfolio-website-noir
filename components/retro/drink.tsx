"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { Glass } from "./drink-scene"
import "./drink.css"

const DrinkScene = dynamic(() => import("./drink-scene"), { ssr: false })

export function Drink() {
  const [glass, setGlass] = useState<Glass>("empty")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const go = (now: Glass, next: Glass, ms: number) => {
    setGlass(now)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setGlass(next), ms)
  }

  const busy = glass === "pour" || glass === "drain"

  return (
    <section id="break" className="r-section dk">
      <div>
        <h2 className="r-h2">Tired?</h2>
        <p className="dk-copy">Understandable. It&apos;s a lot.</p>
        <p className="dk-copy">Here&apos;s a drink.</p>
        <button
          className="dk-btn"
          disabled={busy}
          onClick={() => (glass === "full" ? go("drain", "empty", 2200) : go("pour", "full", 3000))}
        >
          {glass === "pour" ? "Pouring..." : glass === "full" || glass === "drain" ? "Drink up" : "Take a drink"}
        </button>
      </div>

      <div className="dk-stage" role="img" aria-label={glass === "empty" ? "An empty glass" : "A drink on the rocks"}>
        <DrinkScene glass={glass} />
      </div>
    </section>
  )
}
