import { Check, Circle, Clock, Sprout, Leaf, Flower2, Wheat, FileCheck, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stages = [
  {
    id: "planning",
    label: "Planning",
    icon: FileCheck,
    status: "completed",
    dateRange: "Nov 1 - Nov 15, 2024",
    tasks: [
      { name: "Soil testing completed", completed: true },
      { name: "Seed selection finalized", completed: true },
      { name: "Field preparation done", completed: true },
    ],
  },
  {
    id: "sowing",
    label: "Sowing",
    icon: Sprout,
    status: "completed",
    dateRange: "Nov 16 - Dec 5, 2024",
    tasks: [
      { name: "Seeds sown at optimal depth", completed: true },
      { name: "Initial irrigation completed", completed: true },
      { name: "Germination monitored", completed: true },
    ],
  },
  {
    id: "growth",
    label: "Vegetative Growth",
    icon: Leaf,
    status: "current",
    dateRange: "Dec 6, 2024 - Present",
    tasks: [
      { name: "First nitrogen application", completed: true },
      { name: "Weed control completed", completed: true },
      { name: "Second nitrogen application", completed: false },
      { name: "Pest monitoring ongoing", completed: false },
    ],
  },
  {
    id: "flowering",
    label: "Flowering",
    icon: Flower2,
    status: "upcoming",
    dateRange: "Feb 15 - Mar 10, 2025 (Expected)",
    tasks: [
      { name: "Micronutrient spray", completed: false },
      { name: "Irrigation management", completed: false },
      { name: "Disease monitoring", completed: false },
    ],
  },
  {
    id: "harvest",
    label: "Harvest",
    icon: Wheat,
    status: "upcoming",
    dateRange: "Apr 1 - Apr 15, 2025 (Expected)",
    tasks: [
      { name: "Harvest readiness check", completed: false },
      { name: "Equipment preparation", completed: false },
      { name: "Harvest and storage", completed: false },
    ],
  },
]

export default function LifecyclePage() {
  const currentStageIndex = stages.findIndex((s) => s.status === "current")
  const completedTasks = stages.flatMap((s) => s.tasks).filter((t) => t.completed).length
  const totalTasks = stages.flatMap((s) => s.tasks).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crop Lifecycle Tracker</h2>
          <p className="text-muted-foreground">
            Wheat - Season 2024-25 • Started Dec 1, 2024
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Next Check-in</p>
            <p className="font-medium">Tomorrow, 8:00 AM</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Progress overview */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">Day 32</p>
                <p className="text-sm text-muted-foreground">Current Day</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">88</p>
                <p className="text-sm text-muted-foreground">Days Left</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-6">
        {stages.map((stage, index) => (
          <Card
            key={stage.id}
            className={`border-border/50 transition-all ${
              stage.status === "current" ? "border-primary/50 shadow-lg" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  stage.status === "completed"
                    ? "bg-primary text-primary-foreground"
                    : stage.status === "current"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stage.status === "completed" ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <stage.icon className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{stage.label}</CardTitle>
                  {stage.status === "current" && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      Current Stage
                    </Badge>
                  )}
                  {stage.status === "completed" && (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                  {stage.status === "upcoming" && (
                    <Badge variant="outline">Upcoming</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{stage.dateRange}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stage.tasks.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    {task.completed ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : stage.status === "current" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary">
                        <Circle className="h-3 w-3 text-primary" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                        <Clock className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                    )}
                    <span
                      className={
                        task.completed ? "text-muted-foreground line-through" : ""
                      }
                    >
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
