import { CONTACT } from "@/lib/content"
import "./signs.css"

const tab = { target: "_blank", rel: "noopener noreferrer" }

export function Signs() {
  return (
    <nav className="r-section r-signs" aria-label="Resume and contact">
      <a href={CONTACT.resume} {...tab} className="r-sign">
        Full Dossier
      </a>
      <a href={`mailto:${CONTACT.email}`} className="r-sign">
        Fan Mail
      </a>
      <a href={CONTACT.linkedin} {...tab} className="r-sign">
        Add to Rolodex
      </a>
    </nav>
  )
}
