"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, ArrowRight, ArrowLeft, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"

const crops = [
  { id: "wheat", name: "Wheat", hindi: "गेहूँ" },
  { id: "rice", name: "Rice", hindi: "चावल" },
  { id: "cotton", name: "Cotton", hindi: "कपास" },
  { id: "sugarcane", name: "Sugarcane", hindi: "गन्ना" },
]

const languages = [
  { id: "en", name: "English", native: "English" },
  { id: "hi", name: "Hindi", native: "हिन्दी" },
  { id: "mr", name: "Marathi", native: "मराठी" },
]

const states = [
  "Maharashtra",
  "Punjab",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Gujarat",
  "Rajasthan",
  "Karnataka",
  "Andhra Pradesh",
  "Tamil Nadu",
  "West Bengal",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    crop: "",
    sowingDate: "",
    state: "",
    district: "",
    village: "",
    language: "en",
  })

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!formData.crop
      case 2:
        return !!formData.sowingDate
      case 3:
        return !!formData.state
      case 4:
        return !!formData.language
      default:
        return false
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">CropMind AI</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {step === 1 && (
              <>
                <CardTitle className="text-2xl">Select Your Crop</CardTitle>
                <CardDescription>Choose the crop you&apos;re currently growing</CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <CardTitle className="text-2xl">Sowing Date</CardTitle>
                <CardDescription>When did you sow or plan to sow your crop?</CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <CardTitle className="text-2xl">Your Location</CardTitle>
                <CardDescription>Help us provide location-specific guidance</CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <CardTitle className="text-2xl">Preferred Language</CardTitle>
                <CardDescription>Choose your language for AI recommendations</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Crop Selection */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {crops.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => setFormData({ ...formData, crop: crop.id })}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all ${
                      formData.crop === crop.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-lg font-medium">{crop.name}</span>
                    <span className="text-sm text-muted-foreground">{crop.hindi}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Sowing Date */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sowingDate">Sowing Date</Label>
                  <Input
                    id="sowingDate"
                    type="date"
                    value={formData.sowingDate}
                    onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  This helps us calculate the current growth stage and provide timely recommendations.
                </p>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    placeholder="Enter district name"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="village">Village / Taluka (Optional)</Label>
                  <Input
                    id="village"
                    placeholder="Enter village or taluka"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>

                <Button variant="outline" className="h-10 w-full gap-2 rounded-xl bg-transparent" type="button">
                  <MapPin className="h-4 w-4" />
                  Use GPS Location
                </Button>
              </div>
            )}

            {/* Step 4: Language */}
            {step === 4 && (
              <div className="space-y-3">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setFormData({ ...formData, language: lang.id })}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-4 transition-all ${
                      formData.language === lang.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-medium">{lang.native}</span>
                      <span className="text-sm text-muted-foreground">{lang.name}</span>
                    </div>
                    {formData.language === lang.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-12 flex-1 gap-2 rounded-xl bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-12 flex-1 gap-2 rounded-xl"
              >
                {step === totalSteps ? "Finish Setup" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
