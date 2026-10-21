"use client"

import { useEffect, useState } from "react"
import { setMuted } from "@/lib/sound"
import "./volume.css"

const KEY = "muted"
const BARS = 8

// the tape's on-screen volume, clicked to mute
export function Volume() {
  const [muted, setMute] = useState(false)

  // a visitor who muted last time stays muted
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") {
        setMute(true)
        setMuted(true)
      }
    } catch {}
  }, [])

  const toggle = () => {
    const next = !muted
    setMute(next)
    setMuted(next)
    try {
      localStorage.setItem(KEY, next ? "1" : "0")
    } catch {}
  }

  return (
    <button className="r-volume" onClick={toggle} aria-pressed={!muted} aria-label="Sound">
      VOL{" "}
      {muted ? (
        "MUTE"
      ) : (
        <span className="r-volume__bars">
          {Array.from({ length: BARS }, (_, i) => (
            <span key={i} style={{ animationDelay: `${i * 40}ms` }}>
              ▮
            </span>
          ))}
        </span>
      )}
    </button>
  )
}
