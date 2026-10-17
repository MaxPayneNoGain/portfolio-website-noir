import "./overlays.css"

export function Overlays() {
  return (
    <div className="r-fx" aria-hidden="true">
      <div className="r-vignette" />
      <div className="r-scan" />
      <div className="r-grain" />
      <div className="r-tracking" />
    </div>
  )
}
