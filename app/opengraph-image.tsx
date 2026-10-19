import { ImageResponse } from "next/og"
import { oswald } from "@/lib/oswald"

export const alt = "Nick Sharma - Software Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const TAGLINE = "SOFTWARE DEVELOPER"

// same tubes as the hero sign
const red = "0 0 4px #fff, 0 0 12px #ff0f2f, 0 0 28px #ff0f2f, 0 0 56px #ff0f2f"
const blue = "0 0 4px #fff, 0 0 12px #1450ff, 0 0 28px #1450ff, 0 0 56px #1450ff"

export default async function Image() {
  const [light, medium] = await Promise.all([oswald(300, "NICKSHARMA"), oswald(500, TAGLINE)])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 110px",
          backgroundColor: "#08080a",
          backgroundImage:
            "radial-gradient(circle at 25% 40%, rgba(255, 15, 47, 0.16), transparent 45%), radial-gradient(circle at 45% 65%, rgba(20, 80, 255, 0.16), transparent 45%)",
          fontFamily: "Oswald",
        }}
      >
        <div style={{ fontSize: 190, fontWeight: 300, lineHeight: 0.9, letterSpacing: 10, color: "#ff8a96", textShadow: red }}>
          NICK
        </div>
        <div
          style={{
            fontSize: 190,
            fontWeight: 300,
            lineHeight: 0.9,
            letterSpacing: 10,
            paddingLeft: 85,
            color: "#8fb0ff",
            textShadow: blue,
          }}
        >
          SHARMA
        </div>
        <div style={{ marginTop: 44, fontSize: 30, fontWeight: 500, letterSpacing: 10, color: "#8f8b82" }}>{TAGLINE}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Oswald", data: light, weight: 300 },
        { name: "Oswald", data: medium, weight: 500 },
      ],
    },
  )
}
