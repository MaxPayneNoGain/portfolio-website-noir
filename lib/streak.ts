// a rain streak drawn once, so each drop is a cheap image copy instead of a stroked line
const PAD = 2
export const SLANT = 0.12

export function streak(len: number, width: number, color: string) {
  const c = document.createElement("canvas")
  c.width = Math.ceil(len * SLANT + PAD * 2)
  c.height = Math.ceil(len + PAD * 2)
  const g = c.getContext("2d")!
  g.strokeStyle = color
  g.lineWidth = width
  g.beginPath()
  g.moveTo(PAD + len * SLANT, PAD)
  g.lineTo(PAD, PAD + len)
  g.stroke()
  return { img: c, len }
}

// draws a streak whose top is at x, y, stretched to len
export function drawStreak(ctx: CanvasRenderingContext2D, s: ReturnType<typeof streak>, x: number, y: number, len: number) {
  const k = len / s.len
  ctx.drawImage(s.img, x - (PAD + s.len * SLANT) * k, y - PAD * k, s.img.width * k, s.img.height * k)
}
