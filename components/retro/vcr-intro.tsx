"use client"

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import "./vcr-intro.css"

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

// "\b" is a backspace
const SCRIPT = ['vcr.isne\b\b\bnsert("nick-sharma.vhs")', "vcr.play()"]

function applyKeys(keys: string) {
  let out = ""
  for (const k of keys) out = k === "\b" ? out.slice(0, -1) : out + k
  return out
}

const LINES = SCRIPT.map(applyKeys)

const pad = (n: number) => String(n).padStart(2, "0")

export function vcrStamp(now: Date) {
  const hours = now.getHours() % 12 || 12
  return {
    date: `${MONTHS[now.getMonth()]} ${pad(now.getDate())} ${now.getFullYear()}`,
    time: `${hours}:${pad(now.getMinutes())} ${now.getHours() < 12 ? "AM" : "PM"}`,
  }
}

function keyDelay(char: string) {
  if (char === "." || char === "(" || char === '"') return 160 + Math.random() * 200
  if (Math.random() < 0.06) return 250 + Math.random() * 200
  return 60 + Math.random() * 90
}

// crt snow: hard black and white specks that run sideways in short dashes
function Snow() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const w = (canvas.width = Math.ceil(window.innerWidth / 2))
    const h = (canvas.height = Math.ceil(window.innerHeight / 3))
    const img = ctx.createImageData(w, h)
    const px = new Uint32Array(img.data.buffer)
    let frame = 0

    const rgb = (r: number, g: number, b: number) =>
      0xff000000 | (Math.min(255, b) << 16) | (Math.min(255, g) << 8) | Math.min(255, r)

    // hum bar: a wide soft band rolling down, with a faint rainbow tint
    const bandH = h * 0.3
    let bandY = Math.random() * h
    let last = performance.now()

    const draw = (now: number) => {
      bandY += ((now - last) / 1000) * h * 0.8
      last = now
      if (bandY > h + bandH) bandY = -bandH

      for (let y = 0; y < h; y++) {
        const d = (y - bandY) / bandH
        const k = Math.abs(d) < 1 ? (1 + Math.cos(d * Math.PI)) / 2 : 0
        const hue = d * Math.PI * 1.5
        const mr = 1 + k * (0.12 + 0.22 * Math.sin(hue))
        const mg = 1 + k * (0.12 + 0.22 * Math.sin(hue + 2.1))
        const mb = 1 + k * (0.12 + 0.22 * Math.sin(hue + 4.2))

        const row = y * w
        let x = 0
        while (x < w) {
          const r = Math.random()
          const v = r < 0.5 ? r * 30 : r < 0.6 ? 110 + r * 60 : 220 + r * 35
          const c = rgb(v * mr, v * mg, v * mb)
          const end = Math.min(w, x + 1 + Math.floor(Math.random() * 3))
          for (; x < end; x++) px[row + x] = c
        }
      }
      ctx.putImageData(img, 0, 0)
      frame = requestAnimationFrame(draw)
    }

    draw(last)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={ref} className="r-snow" aria-hidden="true" />
}

export function VcrIntro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"typing" | "static" | "done">("typing")
  const [played, setPlayed] = useState(false)
  const [typed, setTyped] = useState({ line: 0, text: "" })
  const [stamp, setStamp] = useState({ date: "--- -- ----", time: "--:-- --" })

  const finish = useCallback(() => {
    window.scrollTo(0, 0)
    setPhase("done")
    setPlayed(true)
  }, [])

  useEffect(() => {
    history.scrollRestoration = "manual"
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done")
      return
    }
    setStamp(vcrStamp(new Date()))
  }, [])

  useEffect(() => {
    if (phase !== "typing") return

    let line = 0
    let key = 0
    let text = ""
    let timer: ReturnType<typeof setTimeout>

    const type = () => {
      const keys = SCRIPT[line]
      if (key < keys.length) {
        const k = keys[key++]
        text = k === "\b" ? text.slice(0, -1) : text + k
        setTyped({ line, text })

        const next = keys[key]
        let wait: number
        if (next === undefined) {
          // longer pause before the enter that starts the tape
          wait = line === SCRIPT.length - 1 ? 1000 : 450
        } else if (next === "\b") {
          // a beat to notice the typo, then quick backspaces
          wait = k === "\b" ? 70 + Math.random() * 50 : 300 + Math.random() * 200
        } else {
          wait = keyDelay(next)
        }
        timer = setTimeout(type, wait)
        return
      }

      line++
      key = 0
      text = ""
      setTyped({ line, text })
      if (line >= SCRIPT.length) {
        timer = setTimeout(() => setPhase("static"), 450)
        return
      }
      timer = setTimeout(type, 300)
    }

    timer = setTimeout(type, 700)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "static") return
    const timer = setTimeout(finish, 700)
    return () => clearTimeout(timer)
  }, [phase, finish])

  // skipping during the typing cuts to static first
  const skip = useCallback(() => (phase === "typing" ? setPhase("static") : finish()), [phase, finish])

  useEffect(() => {
    if (phase === "done") return
    const onKey = (e: KeyboardEvent) => {
      // leave browser shortcuts alone
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      skip()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, skip])

  const mode = typed.line >= LINES.length ? "PLAY ▶" : "STOP ■"

  return (
    <>
      {phase !== "done" && (
        <div className={`r-vcr r-vcr--${phase}`} onClick={skip} role="presentation">
          <div className="r-vcr__row">
            <span>{mode}</span>
            <span>SP</span>
          </div>
          <pre className="r-vcr__code">
            {LINES.map((text, i) => (
              <div key={i} className={i > typed.line ? "r-vcr__ghost" : undefined}>
                <span className="r-vcr__prompt">&gt; </span>
                {i === typed.line ? typed.text : text}
                {i === typed.line && <span className="r-blink">█</span>}
              </div>
            ))}
          </pre>
          <div className="r-vcr__row">
            <span>{stamp.date}</span>
            <span>{stamp.time}</span>
          </div>
          <div className="r-vcr__skip">CLICK OR PRESS ANY KEY TO SKIP</div>
          {phase === "static" && <Snow />}
        </div>
      )}
      {/* keeps tab out of the page while the tape is loading */}
      <div className={played ? "r-crt-on" : undefined} inert={phase !== "done"}>
        {children}
      </div>
    </>
  )
}
