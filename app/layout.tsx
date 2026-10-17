import type React from "react"
import type { Metadata } from "next"
import { Oswald, Special_Elite, VT323 } from "next/font/google"
import "./globals.css"

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--r-font-type",
})

const headline = Oswald({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  display: "swap",
  variable: "--r-font-head",
})

const lcd = VT323({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--r-font-lcd",
})

export const metadata: Metadata = {
  title: "Nick Sharma",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${typewriter.variable} ${headline.variable} ${lcd.variable}`}>
      <body>{children}</body>
    </html>
  )
}
