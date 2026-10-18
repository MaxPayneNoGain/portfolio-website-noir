import { Arcade } from "@/components/retro/arcade"
import { Contact } from "@/components/retro/contact"
import { Drink } from "@/components/retro/drink"
import { Footer } from "@/components/retro/footer"
import { FrontPage } from "@/components/retro/front-page"
import { Hero } from "@/components/retro/hero"
import { Hud } from "@/components/retro/hud"
import { Jukebox } from "@/components/retro/jukebox"
import { Overlays } from "@/components/retro/overlays"
import { Signs } from "@/components/retro/signs"
import { VcrIntro } from "@/components/retro/vcr-intro"
import { Weather } from "@/components/retro/weather"

export default function Home() {
  return (
    <VcrIntro>
      <Weather />
      <Overlays />
      <Hud />
      <main className="r-main">
        <Hero />
        <FrontPage />
        <Arcade />
        <Signs />
        <Drink />
        <Jukebox />
        <Contact />
      </main>
      <Footer />
    </VcrIntro>
  )
}
