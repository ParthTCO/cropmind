import { Check, Sprout, Leaf, Flower2, Wheat, FileCheck, Loader2, Droplet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LifecycleStage } from "@/lib/api"

// Icon mapping for different stage IDs
const stageIcons: Record<string, any> = {
  planning: FileCheck,
  sowing: Sprout,
  germination: Droplet,
  vegetative: Leaf,
  flowering: Flower2,
  harvest: Wheat,
  growth: Leaf,
}

interface LifecycleTimelineProps {
  stages?: LifecycleStage[];
  loading?: boolean;
}

export function LifecycleTimeline({ stages = [], loading = false }: LifecycleTimelineProps) {
  // Calculate progress percentage based on completed stages
  const completedCount = stages.filter(s => s.status === "completed").length;
  const currentIndex = stages.findIndex(s => s.status === "current");
  const progressPercentage = stages.length > 0
    ? ((completedCount + (currentIndex >= 0 ? 0.5 : 0)) / stages.length) * 100
    : 0;

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Crop Lifecycle Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-11 w-11 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border" />
            <div
              className="absolute left-[22px] top-0 w-0.5 bg-primary transition-all"
              style={{ height: `${progressPercentage}%` }}
            />

            <div className="space-y-6">
              {stages.map((stage) => {
                const Icon = stageIcons[stage.id] || Leaf;
                return (
                  <div key={stage.id} className="relative flex items-center gap-4">
                    <div
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all ${stage.status === "completed"
                          ? "border-primary bg-primary text-primary-foreground"
                          : stage.status === "current"
                            ? "border-primary bg-background text-primary"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                    >
                      {stage.status === "completed" ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p
                          className={`font-medium ${stage.status === "current" ? "text-primary" : ""
                            }`}
                        >
                          {stage.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{stage.date}</p>
                      </div>
                      {stage.status === "current" && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Current Stage
                        </span>
                      )}
                      {stage.status === "completed" && (
                        <span className="text-xs text-muted-foreground">Completed</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

