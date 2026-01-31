"use client"

import { useEffect, useState } from "react"
import { Cloud, Bug, Droplets, Wheat, AlertTriangle, Bell, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getAlerts, Alert as AlertType } from "@/lib/api"

const iconMap: Record<string, any> = {
  weather: Cloud,
  Weather: Cloud,
  pest: Bug,
  Pest: Bug,
  action: Droplets,
  harvest: Wheat,
  default: AlertTriangle,
}

const colorMap: Record<string, { icon: string; bg: string }> = {
  weather: { icon: "text-blue-500", bg: "bg-blue-500/10" },
  Weather: { icon: "text-blue-500", bg: "bg-blue-500/10" },
  pest: { icon: "text-red-500", bg: "bg-red-500/10" },
  Pest: { icon: "text-red-500", bg: "bg-red-500/10" },
  action: { icon: "text-primary", bg: "bg-primary/10" },
  Stage: { icon: "text-amber-500", bg: "bg-amber-500/10" },
}

const severityColors = {
  Critical: "bg-red-500/10 text-red-600 dark:text-red-400",
  Warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Info: "bg-muted text-muted-foreground",
}

export default function AlertsPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAlerts() {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getAlerts(user.email)
        setAlerts(data)
      } catch (err) {
        console.error("Failed to fetch alerts:", err)
        setError("Failed to load alerts")
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [user?.email])

  const getIcon = (type: string) => {
    return iconMap[type] || iconMap.default
  }

  const getColors = (type: string) => {
    return colorMap[type] || { icon: "text-orange-500", bg: "bg-orange-500/10" }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    return "Just now"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alerts & Notifications</h2>
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${alerts.length} notification${alerts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading alerts...</p>
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              You'll receive important notifications about weather, pest alerts, and farming actions here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alerts list */}
      {!loading && alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = getIcon(alert.type)
            const colors = getColors(alert.type)

            return (
              <Card
                key={alert.id}
                className="border-border/50 transition-all hover:shadow-md"
              >
                <CardContent className="flex gap-4 p-4 sm:p-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{alert.type} Alert</h3>
                      <Badge className={severityColors[alert.severity as keyof typeof severityColors] || severityColors.Info}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(alert.created_at)}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
