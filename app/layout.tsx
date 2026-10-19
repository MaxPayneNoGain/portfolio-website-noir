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

const title = "Nick Sharma - Software Developer"
const description = "Software developer and computer science student at Southern Miss. Work, projects, skills and contact."

export const metadata: Metadata = {
  metadataBase: new URL("https://nischitsharma.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Nick Sharma",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
