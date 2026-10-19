"use client"

import { useEffect, useRef, useState } from "react"
import { Press_Start_2P } from "next/font/google"
import { PROJECTS, WORK } from "@/lib/content"
import "./arcade.css"

const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" })

const WORLDS = [
  { name: "WORK", stages: WORK },
  { name: "PROJECTS", stages: PROJECTS },
]

// 7x7 pixel heart
function Heart() {
  return (
    <svg viewBox="0 0 7 7" className="arc-heart" aria-hidden="true">
      <path d="M1 0h2v1h1V0h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1H0V1h1z" />
    </svg>
  )
}

export function Arcade() {
  const [credit, setCredit] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [pick, setPick] = useState(WORK[0].id)
  const firstStage = useRef<HTMLButtonElement>(null)
  const entry = [...WORK, ...PROJECTS].find((e) => e.id === pick)!

  useEffect(() => {
    if (!credit) return
    const t = setTimeout(() => setPlaying(true), 900)
    return () => clearTimeout(t)
  }, [credit])

  // the coin button goes away when the game starts, so hand focus to the stages
  useEffect(() => {
    if (playing) firstStage.current?.focus({ preventScroll: true })
  }, [playing])

  const insert = () => setCredit(true)

  return (
    <section id="work" className="r-section">
      <div className={`arc ${pixel.className}`}>
        <div className="arc-screen">
          <div className="arc-top">
            <span className="arc-lives" aria-label="3 lives">
              <Heart />
              <Heart />
              <Heart />
            </span>
            {playing && <span className="arc-top__mid">SELECT STAGE</span>}
            {/* coin is spent once the game starts */}
            <span>CREDIT {credit && !playing ? 1 : 0}</span>
          </div>

          {playing ? (
            <div className="arc-grid">
              <div>
                {WORLDS.map((w, wi) => (
                  <div key={w.name}>
                    <div className="arc-head">
                      WORLD {wi + 1}: {w.name}
                    </div>
                    {w.stages.map((e, i) => (
                      <button
                        key={e.id}
                        ref={wi === 0 && i === 0 ? firstStage : undefined}
                        className={`arc-stage${pick === e.id ? " is-on" : ""}`}
                        aria-pressed={pick === e.id}
                        onClick={() => setPick(e.id)}
                      >
                        <span>
                          {wi + 1}-{i + 1}
                        </span>
                        <span>{e.title.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              {/* remount so the fade replays */}
              <div key={pick} className="arc-brief">
                <div className="arc-brief__title">{entry.title.toUpperCase()}</div>
                <div className="arc-brief__meta">{entry.org.toUpperCase()}</div>
                {entry.dates && <div className="arc-brief__meta">{entry.dates}</div>}
                <ul>
                  {entry.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {entry.tech && <div className="arc-brief__tech">POWER-UPS: {entry.tech.join(" · ")}</div>}
              </div>
            </div>
          ) : (
            <div className="arc-attract">
              <div className="arc-logo">NICK SHARMA</div>
              <div className="arc-sub">WORK &amp; PROJECTS</div>
              {/* same button in both states so focus isn't dropped */}
              <button className="arc-coin r-blink" onClick={insert} aria-disabled={credit}>
                {credit ? "PLAYER 1 READY" : "INSERT COIN"}
              </button>
              <div className="arc-fine">1 COIN 1 PLAY</div>
            </div>
          )}
        </div>

        <div className="arc-door">
          {[0, 1].map((n) => (
            <button
              key={n}
              className="arc-slot"
              onClick={insert}
              disabled={credit}
              aria-label="Insert coin"
              tabIndex={-1}
            >
              25¢
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
