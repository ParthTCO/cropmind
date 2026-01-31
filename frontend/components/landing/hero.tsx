"use client"

import Link from "next/link"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Powered by Advanced AI Agents</span>
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            AI That Guides Farmers Through{" "}
            <span className="text-primary">Every Stage</span> of Farming
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            From sowing to harvest, CropMind AI adapts daily to your farm, weather, crop stage, and local conditions. 
            Get personalized recommendations in your language.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/login">
              <Button size="lg" className="h-12 gap-2 rounded-xl px-8 text-base">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-12 gap-2 rounded-xl px-8 text-base bg-transparent">
                <Play className="h-4 w-4" />
                View Dashboard Demo
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-16">
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by farmers and agronomists across India
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
              <div className="text-lg font-semibold">10,000+ Farmers</div>
              <div className="text-lg font-semibold">500+ Villages</div>
              <div className="text-lg font-semibold">15 States</div>
              <div className="text-lg font-semibold">95% Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-4 text-sm text-muted-foreground">CropMind AI Dashboard</span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="mb-2 text-sm text-muted-foreground">Current Stage</div>
                <div className="text-xl font-semibold text-primary">Vegetative</div>
                <div className="mt-1 text-sm text-muted-foreground">Day 32 of 120</div>
              </div>
              <div className="rounded-xl bg-primary/10 p-4">
                <div className="mb-2 text-sm text-muted-foreground">Today&apos;s Action</div>
                <div className="text-lg font-semibold">Apply Nitrogen</div>
                <div className="mt-1 text-sm text-muted-foreground">After rainfall stops</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="mb-2 text-sm text-muted-foreground">Weather Alert</div>
                <div className="text-lg font-semibold">Rain Expected</div>
                <div className="mt-1 text-sm text-muted-foreground">Tomorrow, 60% chance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
