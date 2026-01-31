"use client"

import { Check, Sprout, Leaf, Flower2, Wheat } from "lucide-react"

const stages = [
  { id: "planning", label: "Planning", icon: Check, status: "completed" },
  { id: "sowing", label: "Sowing", icon: Sprout, status: "completed" },
  { id: "growth", label: "Growth", icon: Leaf, status: "current" },
  { id: "flowering", label: "Flowering", icon: Flower2, status: "upcoming" },
  { id: "harvest", label: "Harvest", icon: Wheat, status: "upcoming" },
]

export function LifecyclePreview() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Track Your Complete Crop Lifecycle
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Visualize your farming journey from planning to harvest. Our timeline 
              tracks progress, highlights completed milestones, and shows upcoming tasks.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground">Stage-specific recommendations tailored to your crop</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground">Automatic progression tracking based on growth patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground">Predictive insights for upcoming farming activities</span>
              </li>
            </ul>
          </div>

          {/* Timeline Visual */}
          <div className="relative rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="mb-6">
              <span className="text-sm font-medium text-muted-foreground">Wheat - Season 2025</span>
              <h3 className="mt-1 text-xl font-semibold">Crop Lifecycle Timeline</h3>
            </div>
            
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-4">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        stage.status === "completed"
                          ? "border-primary bg-primary text-primary-foreground"
                          : stage.status === "current"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      <stage.icon className="h-5 w-5" />
                    </div>
                    {index < stages.length - 1 && (
                      <div
                        className={`absolute top-10 h-6 w-0.5 ${
                          stage.status === "completed" ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          stage.status === "current" ? "text-primary" : ""
                        }`}
                      >
                        {stage.label}
                      </span>
                      {stage.status === "current" && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Current
                        </span>
                      )}
                      {stage.status === "completed" && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
