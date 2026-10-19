import { ImageResponse } from "next/og"
import { oswald } from "@/lib/oswald"

export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default async function Icon() {
  const font = await oswald(500, "NS")

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          background: "#08080a",
          fontFamily: "Oswald",
          fontSize: 46,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#ff8a96", textShadow: "0 0 4px #ff0f2f, 0 0 8px #ff0f2f" }}>N</span>
        <span style={{ color: "#8fb0ff", textShadow: "0 0 4px #1450ff, 0 0 8px #1450ff" }}>S</span>
      </div>
    ),
    { ...size, fonts: [{ name: "Oswald", data: font, weight: 500 }] },
  )
}
