"use client"

import { useEffect, useState } from "react"
import { Pacifico } from "next/font/google"
import { SKILLS } from "@/lib/content"
import { jukeKey } from "@/lib/sound"
import "./jukebox.css"

const script = Pacifico({ subsets: ["latin"], weight: "400" })

const LETTERS = ["A", "B", "C", "D", "E"]
// 0 is the tenth song, like a real jukebox
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// strips per column; shorter groups get padded with blank ones
const ROWS = Math.ceil(Math.max(...SKILLS.map((s) => s.items.length)) / 2)

type Pick = { g: number; i: number }

// the keypad is hidden on narrow screens, so the strips need to be tabbable there
function useNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(max-width: 600px)")
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return narrow
}

export function Jukebox() {
  const [pick, setPick] = useState<Pick | null>(null)
  const [letter, setLetter] = useState<number | null>(null)
  const song = pick && SKILLS[pick.g].items[pick.i]
  const narrow = useNarrow()

  const press = (n: number) => {
    jukeKey()
    if (letter === null) return
    if (n <= SKILLS[letter].items.length) setPick({ g: letter, i: n - 1 })
    setLetter(null)
  }

  const line = (g: number, i: number) => {
    const name = SKILLS[g].items[i]
    if (!name) return <span className="jb-song" />
    return (
      <button
        className={`jb-song${pick?.g === g && pick.i === i ? " is-on" : ""}`}
        aria-pressed={pick?.g === g && pick.i === i}
        // the keypad is how you pick with a keyboard, so the strips stay out of the tab order
        tabIndex={narrow ? undefined : -1}
        onClick={() => {
          jukeKey()
          setPick({ g, i })
        }}
      >
        <span className="jb-code">
          {LETTERS[g]}
          {i + 1}
        </span>
        {name}
      </button>
    )
  }

  return (
    <section id="skills" className="r-section">
      <div className={`jb${pick ? " is-playing" : ""}`}>
        <div className="jb-arch">
          <div className="jb-arch__inner">
            <div className={`jb-marquee ${script.className}`}>Skills</div>
          </div>
        </div>

        <div className="jb-body">
          <span className="jb-tube" />

          <div className="jb-center">
            <div className="jb-window">
              {SKILLS.map((s, g) => (
                <div key={s.group} className={`jb-col jb-col--${g}`}>
                  {Array.from({ length: ROWS }, (_, k) => (
                    <div key={k} className={`jb-strip${s.items[k * 2] ? "" : " is-blank"}`}>
                      {line(g, k * 2)}
                      <div className="jb-strip__band">{s.items[k * 2] ? s.group : ""}</div>
                      {line(g, k * 2 + 1)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="jb-deck">
              <div className="jb-turntable">
                <div className="jb-record">
                  <span className={`jb-record__label jb-col--${pick?.g ?? 0}`} />
                </div>
                <span className="jb-arm" />
              </div>

              <div className="jb-now">
                <div className="jb-now__label">NOW PLAYING</div>
                <div className="jb-now__song" aria-live="polite">
                  {letter !== null
                    ? `${LETTERS[letter]}_`
                    : pick && song
                      ? `${LETTERS[pick.g]}${pick.i + 1}  ${song.toUpperCase()}`
                      : "MAKE A SELECTION"}
                </div>
              </div>

              <div className="jb-keys">
                <div className="jb-keys__row">
                  {LETTERS.map((l, g) => (
                    <button
                      key={l}
                      className={letter === g ? "is-on" : undefined}
                      aria-pressed={letter === g}
                      onClick={() => {
                        jukeKey()
                        setLetter(g)
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <div className="jb-keys__row">
                  {NUMBERS.map((n) => (
                    <button key={n} onClick={() => press(n)}>
                      {n % 10}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <span className="jb-tube" />
        </div>

        <div className="jb-grille" />
      </div>
    </section>
  )
}
