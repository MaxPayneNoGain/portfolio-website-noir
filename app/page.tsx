import { Overlays } from "@/components/retro/overlays"
import { VcrIntro } from "@/components/retro/vcr-intro"

export default function Home() {
  return (
    <VcrIntro>
      <Overlays />
      <main className="r-main">
        <section className="r-section">
          <h1 className="r-h2">Nick Sharma</h1>
        </section>
      </main>
    </VcrIntro>
  )
}
