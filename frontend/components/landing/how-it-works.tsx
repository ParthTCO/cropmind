import { Eye, Brain, Zap, RefreshCw } from "lucide-react"

const steps = [
  {
    icon: Eye,
    title: "Observe",
    description: "Our AI agents continuously monitor weather patterns, soil conditions, and crop health data specific to your farm.",
  },
  {
    icon: Brain,
    title: "Decide",
    description: "Advanced algorithms analyze all factors and generate personalized recommendations for your exact situation.",
  },
  {
    icon: Zap,
    title: "Act",
    description: "Receive clear, actionable guidance in your preferred language. Know exactly what to do and when.",
  },
  {
    icon: RefreshCw,
    title: "Update",
    description: "The system learns from outcomes and adapts recommendations as conditions change throughout the season.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-muted/30 px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How CropMind AI Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our intelligent agents work continuously to guide you through every decision
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="group relative">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="text-4xl font-bold text-muted-foreground/30">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
