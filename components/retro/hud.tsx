"use client"

import { useEffect, useState } from "react"
import { vcrStamp } from "./vcr-intro"
import "./hud.css"

const pad = (n: number) => String(n).padStart(2, "0")

function tapeTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}:${pad(m)}:${pad(seconds % 60)}`
}

type Deck = "play" | "stop" | "rew"

export function Hud() {
  const [now, setNow] = useState<Date | null>(null)
  const [start, setStart] = useState(0)
  const [deck, setDeck] = useState<Deck>("play")

  useEffect(() => {
    setStart(Date.now())
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const end = document.getElementById("end")
    if (!end) return
    let rewinding = false

    const watch = new IntersectionObserver(([e]) => {
      if (!rewinding) setDeck(e.isIntersecting ? "stop" : "play")
    })
    watch.observe(end)

    const rewind = () => {
      rewinding = true
      setDeck("rew")
    }
    const onScroll = () => {
      if (rewinding && window.scrollY < 4) {
        rewinding = false
        setDeck("play")
      }
    }
    window.addEventListener("tape:rewind", rewind)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      watch.disconnect()
      window.removeEventListener("tape:rewind", rewind)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const stamp = now ? vcrStamp(now) : { date: "--- -- ----", time: "--:-- --" }
  const [hours, rest] = stamp.time.split(":")
  const elapsed = now ? Math.max(0, Math.floor((now.getTime() - start) / 1000)) : 0

  return (
    <div className="r-hud" aria-hidden="true">
      <div className="r-hud__tl">
        {deck === "play" && (
          <>
            PLAY <span className="r-blink">▶</span>
          </>
        )}
        {deck === "stop" && "STOP ■"}
        {deck === "rew" && (
          <>
            REW <span className="r-blink">◄◄</span>
          </>
        )}
      </div>
      <div className="r-hud__tr">SP {tapeTime(elapsed)}</div>
      <div className="r-hud__bl">
        {stamp.date}
        <br />
        {hours}
        <span className="r-blink">:</span>
        {rest}
      </div>
    </div>
  )
}
