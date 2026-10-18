import { Hero } from "@/components/retro/hero"
import { Overlays } from "@/components/retro/overlays"
import { VcrIntro } from "@/components/retro/vcr-intro"

export default function Home() {
  return (
    <VcrIntro>
      <Overlays />
      <main className="r-main">
        <Hero />
      </main>
    </VcrIntro>
  )
}
