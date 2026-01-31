import { LandingHero } from "@/components/landing/hero"
import { LandingNav } from "@/components/landing/nav"
import { HowItWorks } from "@/components/landing/how-it-works"
import { LifecyclePreview } from "@/components/landing/lifecycle-preview"
import { Features } from "@/components/landing/features"
import { Testimonials } from "@/components/landing/testimonials"
import { LandingFooter } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <LandingHero />
        <HowItWorks />
        <LifecyclePreview />
        <Features />
        <Testimonials />
      </main>
      <LandingFooter />
    </div>
  )
}
