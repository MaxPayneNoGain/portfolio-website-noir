"use client"

import "./footer.css"

export function Footer() {
  const rewind = () => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.dispatchEvent(new Event("tape:rewind"))
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" })
    // so the next tab starts from the top too
    document.getElementById("name")?.focus({ preventScroll: true })
  }

  return (
    <footer id="end" className="r-footer">
      <div className="r-wrap r-footer__row">
        <button className="r-footer__rew" onClick={rewind}>
          ◄◄ REWIND
        </button>
        <span className="r-footer__end">END OF TAPE</span>
        <span className="r-footer__copy">© {new Date().getFullYear()} Nischit Raj Sharma. All rights reserved.</span>
      </div>
    </footer>
  )
}
