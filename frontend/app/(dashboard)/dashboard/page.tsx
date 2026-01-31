"use client"

import { useEffect, useState } from "react"
import { CropStageCard } from "@/components/dashboard/crop-stage-card"
import { TodayActionCard } from "@/components/dashboard/today-action-card"
import { WeatherWidget } from "@/components/dashboard/weather-widget"
import { LifecycleTimeline } from "@/components/dashboard/lifecycle-timeline"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useAuth } from "@/lib/auth-context"
import {
  getDashboardSummary,
  getWeather,
  getLifecycleStatus,
  getUserInfo,
  getTimeBasedGreeting,
  DashboardSummary,
  WeatherData,
  LifecycleStatus,
  UserInfo
} from "@/lib/api"

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [lifecycleData, setLifecycleData] = useState<LifecycleStatus | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [summary, weather, lifecycle, info] = await Promise.allSettled([
          getDashboardSummary(user.email),
          getWeather(user.email),
          getLifecycleStatus(user.email),
          getUserInfo(user.email)
        ])

        if (summary.status === "fulfilled") setDashboardData(summary.value)
        if (weather.status === "fulfilled") setWeatherData(weather.value)
        if (lifecycle.status === "fulfilled") setLifecycleData(lifecycle.value)
        if (info.status === "fulfilled") setUserInfo(info.value)

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.email])

  // Get greeting and user display name
  const greeting = getTimeBasedGreeting()
  const displayName = userInfo?.name || user?.displayName || "Farmer"
  const cropType = userInfo?.crop_type || lifecycleData?.crop || "crop"

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {greeting}, {displayName}
        </h2>
        <p className="text-muted-foreground">
          {user?.email
            ? `Here's what's happening with your ${cropType} today.`
            : "Sign in to see personalized farming insights."}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Crop Stage */}
        <CropStageCard
          stage={dashboardData?.current_stage}
          dayCount={dashboardData?.day_count}
          totalDays={120}
          progress={dashboardData?.progress_percentage}
          loading={loading && !!user?.email}
        />

        {/* Today's Action - spans 2 columns on lg */}
        <div className="lg:col-span-2">
          <TodayActionCard
            action={dashboardData?.today_action?.split('.')[0]}
            details={dashboardData?.today_action}
            tags={["AI Recommendation"]}
            updatedAt="Just now"
            loading={loading && !!user?.email}
          />
        </div>

        {/* Weather Widget */}
        <WeatherWidget
          temperature={weatherData?.temperature}
          feelsLike={weatherData?.feels_like}
          condition={weatherData?.condition}
          humidity={weatherData?.humidity}
          windSpeed={weatherData?.wind_speed}
          rainChance={weatherData?.rain_chance}
          rainAmount={weatherData?.rain_amount}
          alert={weatherData?.alert}
          loading={loading && !!user?.email}
        />

        {/* Lifecycle Timeline - spans 2 columns */}
        <div className="md:col-span-2">
          <LifecycleTimeline
            stages={lifecycleData?.timeline}
            loading={loading && !!user?.email}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}

