"use client"

import { useEffect, useState } from "react"
import { CONTACT } from "@/lib/content"
import "./contact.css"

const PAGER_MESSAGES = ["PAGE ME", "OPEN 2 WORK", "1 NEW MSG", "HIRING?", "CALL BACK"]
const GREETING = "Hi, you've reached Nick. I can't get to the phone right now, but leave a message and I'll get back to you."
const EMAIL = `mailto:${CONTACT.email}`
const HEIGHTS = [
  ["6'3", 12],
  ["6'0", 32],
  ["5'9", 52],
  ["5'6", 72],
  ["5'3", 92],
] as const

// starts empty so the server render matches the first client render
function useClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}

const pad = (n: number) => String(n).padStart(2, "0")

function Pager() {
  const now = useClock()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PAGER_MESSAGES.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="ct-pager">
      <div className="ct-pager__top">
        <span className="ct-pager__led" />
      </div>
      <div className="ct-pager__lcd" aria-hidden="true">
        <div className="ct-pager__status">
          <span>◆ {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : "--:--"}</span>
          <span>▮▮▮</span>
        </div>
        <div key={index} className="ct-pager__msg">
          {PAGER_MESSAGES[index]}
        </div>
      </div>
      <div className="ct-pager__buttons">
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="ct-pager__btn">
          LinkedIn
        </a>
        <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="ct-pager__btn">
          GitHub
        </a>
        <a href={CONTACT.resume} target="_blank" rel="noopener noreferrer" className="ct-pager__btn">
          Resume
        </a>
      </div>
    </div>
  )
}

function AnsweringMachine() {
  const [state, setState] = useState<"new" | "playing" | "done">("new")
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (state !== "playing") return
    if (typed >= GREETING.length) {
      setState("done")
      return
    }
    const t = setTimeout(() => setTyped((v) => v + 1), 28)
    return () => clearTimeout(t)
  }, [state, typed])

  const play = () => {
    setTyped(0)
    setState("playing")
  }

  return (
    <div className="ct-am">
      <div className="ct-am__top">
        <div className={`ct-am__led${state === "new" ? " r-blink" : ""}`}>{state === "new" ? "1" : "0"}</div>
        <div className={`ct-am__tape${state === "playing" ? " is-playing" : ""}`}>
          <span />
          <span />
        </div>
        <div className="ct-am__brand">ANSWERING MACHINE</div>
      </div>
      <div className="ct-am__screen">
        {state === "new" ? "1 NEW MESSAGE" : GREETING.slice(0, typed)}
        {state === "done" && <span className="ct-am__beep"> *BEEP*</span>}
      </div>
      <div className="ct-am__buttons">
        <button onClick={play}>▶ PLAY</button>
        <a href={EMAIL} className={state === "done" ? "is-ready" : undefined}>
          ● LEAVE A MESSAGE
        </a>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="r-section ct">
      <div className="ct-desk">
        <AnsweringMachine />
        <Pager />
      </div>

      <figure className="ct-mug">
        <figcaption className="ct-mug__title">
          WANTED
          <small>(for hire)</small>
        </figcaption>
        <div className="ct-mug__photo">
          <img src="/images/portrait.jpg" alt="Nick Sharma" />
          <div className="ct-mug__chart" aria-hidden="true">
            {HEIGHTS.map(([h, top]) => (
              <span key={h} style={{ top: `${top}%` }}>
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="ct-mug__note">IF SEEN, MAKE CONTACT</div>
        <a href={EMAIL} className="ct-mug__email">
          {CONTACT.email}
        </a>
      </figure>
    </section>
  )
}
