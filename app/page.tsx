import { Arcade } from "@/components/retro/arcade"
import { Contact } from "@/components/retro/contact"
import { Drink } from "@/components/retro/drink"
import { FrontPage } from "@/components/retro/front-page"
import { Hero } from "@/components/retro/hero"
import { Hud } from "@/components/retro/hud"
import { Jukebox } from "@/components/retro/jukebox"
import { Overlays } from "@/components/retro/overlays"
import { VcrIntro } from "@/components/retro/vcr-intro"

export default function Home() {
  return (
    <VcrIntro>
      <Overlays />
      <Hud />
      <main className="r-main">
        <Hero />
        <FrontPage />
        <Arcade />
        <Drink />
        <Jukebox />
        <Contact />
      </main>
    </VcrIntro>
  )
}
