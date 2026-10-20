"use client"

import { type FocusEvent, useEffect, useRef } from "react"
import { CONTACT } from "@/lib/content"
import { neon } from "@/lib/sound"
import "./signs.css"

const tab = { target: "_blank", rel: "noopener noreferrer" }

// only keyboard focus lights the sign, same as :focus-visible
const onFocus = (e: FocusEvent) => {
  if (e.currentTarget.matches(":focus-visible")) neon()
}

const sign = { className: "r-sign", onMouseEnter: neon, onFocus }

export function Signs() {
  const ref = useRef<HTMLElement>(null)

  // no hover on phones, so they light up once scrolled into view
  useEffect(() => {
    const nav = ref.current
    if (!nav || !window.matchMedia("(hover: none)").matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        nav.querySelectorAll(".r-sign").forEach((sign) => sign.classList.add("is-lit"))
        neon()
        io.disconnect()
      },
      { threshold: 0.8 },
    )
    io.observe(nav)
    return () => io.disconnect()
  }, [])

  return (
    <nav ref={ref} className="r-section r-signs" aria-label="Resume and contact">
      <a href={CONTACT.resume} {...tab} {...sign}>
        Full Dossier
      </a>
      <a href={`mailto:${CONTACT.email}`} {...sign}>
        Fan Mail
      </a>
      <a href={CONTACT.linkedin} {...tab} {...sign}>
        Add to Rolodex
      </a>
    </nav>
  )
}
