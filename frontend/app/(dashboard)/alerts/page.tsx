import { Cloud, Bug, Droplets, Wheat, AlertTriangle, Bell, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const alerts = [
  {
    id: "1",
    type: "weather",
    priority: "high",
    title: "Heavy Rain Expected Tomorrow",
    description: "60% chance of rainfall (15-20mm) expected tomorrow. Postpone irrigation and fertilizer application until rain passes.",
    time: "2 hours ago",
    icon: Cloud,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    read: false,
  },
  {
    id: "2",
    type: "pest",
    priority: "high",
    title: "Aphid Outbreak Risk in Your Region",
    description: "Neighboring farms in Nashik district reporting aphid infestations. Inspect your crop and consider preventive spray.",
    time: "5 hours ago",
    icon: Bug,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    read: false,
  },
  {
    id: "3",
    type: "action",
    priority: "medium",
    title: "Nitrogen Application Reminder",
    description: "Your wheat crop is at Day 32. Second nitrogen application recommended within the next 5 days for optimal growth.",
    time: "1 day ago",
    icon: Droplets,
    color: "text-primary",
    bgColor: "bg-primary/10",
    read: false,
  },
  {
    id: "4",
    type: "harvest",
    priority: "low",
    title: "Harvest Preparation Milestone",
    description: "Your crop is 88 days away from expected harvest. Start planning storage and transportation logistics.",
    time: "2 days ago",
    icon: Wheat,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    read: true,
  },
  {
    id: "5",
    type: "weather",
    priority: "medium",
    title: "Temperature Drop Expected",
    description: "Minimum temperature expected to drop to 8°C this weekend. No action required for wheat at current stage.",
    time: "3 days ago",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    read: true,
  },
]

const priorityColors = {
  high: "bg-red-500/10 text-red-600 dark:text-red-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  low: "bg-muted text-muted-foreground",
}

export default function AlertsPage() {
  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alerts & Notifications</h2>
          <p className="text-muted-foreground">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-lg bg-transparent">
            <Check className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg bg-transparent">
            <Bell className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filter badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          All ({alerts.length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/50">
          Weather ({alerts.filter((a) => a.type === "weather").length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/50">
          Pest Alerts ({alerts.filter((a) => a.type === "pest").length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/50">
          Actions ({alerts.filter((a) => a.type === "action").length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/50">
          High Priority ({alerts.filter((a) => a.priority === "high").length})
        </Badge>
      </div>

      {/* Alerts list */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={`border-border/50 transition-all hover:shadow-md ${
              !alert.read ? "border-l-4 border-l-primary" : ""
            }`}
          >
            <CardContent className="flex gap-4 p-4 sm:p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${alert.bgColor}`}>
                <alert.icon className={`h-6 w-6 ${alert.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`font-semibold ${!alert.read ? "" : "text-muted-foreground"}`}>
                    {alert.title}
                  </h3>
                  <Badge className={priorityColors[alert.priority as keyof typeof priorityColors]}>
                    {alert.priority === "high" ? "High Priority" : alert.priority === "medium" ? "Action Required" : "Info"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
              {!alert.read && (
                <div className="flex h-3 w-3 shrink-0 rounded-full bg-primary" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load more */}
      <div className="text-center">
        <Button variant="outline" className="rounded-lg bg-transparent">
          Load More Alerts
        </Button>
      </div>
    </div>
  )
}
