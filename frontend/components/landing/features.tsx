import { Languages, Cloud, MessageSquare, Bell, LineChart, Shield } from "lucide-react"

const features = [
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Get guidance in English, Hindi, or Marathi. Our AI understands and responds in your preferred language.",
  },
  {
    icon: Cloud,
    title: "Weather Integration",
    description: "Real-time weather data and forecasts integrated into every recommendation for your specific location.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Ask questions about pests, irrigation, fertilizers, or any farming issue. Get instant expert guidance.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Proactive notifications for weather warnings, pest outbreaks, and critical farming windows.",
  },
  {
    icon: LineChart,
    title: "Continuous Guidance",
    description: "Daily adaptive recommendations that evolve with your crop stage and changing conditions.",
  },
  {
    icon: Shield,
    title: "Expert Validated",
    description: "All recommendations are validated by agricultural experts and based on proven farming practices.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need for Smarter Farming
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive tools and features designed specifically for Indian farmers
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
