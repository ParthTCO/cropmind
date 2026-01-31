"use client"

import { useEffect, useState } from "react"
import { Check, Circle, Clock, Sprout, Leaf, Flower2, Wheat, FileCheck, CalendarDays, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { getLifecycleStatus, toggleTask, advanceStage, LifecycleStatus } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { StageChatDrawer } from "@/components/lifecycle/stage-chat-drawer"
import { MessageSquare } from "lucide-react"

const stageIcons: Record<string, any> = {
  planning: FileCheck,
  sowing: Sprout,
  growth: Leaf,
  vegetative: Leaf,
  flowering: Flower2,
  harvest: Wheat,
}

export default function LifecyclePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<LifecycleStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toggling, setToggling] = useState<number | null>(null)
  const [chatStage, setChatStage] = useState<{ id: string, label: string } | null>(null)

  const fetchData = async () => {
    if (!user?.email) return
    try {
      setLoading(true)
      const status = await getLifecycleStatus(user.email)
      setData(status)
    } catch (err) {
      console.error("Failed to fetch lifecycle:", err)
      setError("Failed to load lifecycle data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user?.email])

  const handleToggleTask = async (taskId: number) => {
    if (!user?.email || toggling) return
    try {
      setToggling(taskId)
      await toggleTask(user.email, taskId)
      // Optimistically update local state or re-fetch
      if (data) {
        const newData = { ...data }
        newData.timeline = newData.timeline.map(stage => ({
          ...stage,
          tasks: stage.tasks.map(task =>
            task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
          )
        }))
        setData(newData)
      }
    } catch (err) {
      console.error("Toggle failed:", err)
    } finally {
      setToggling(null)
    }
  }

  const handleAdvanceStage = async () => {
    if (!user?.email || loading) return
    try {
      setLoading(true)
      await advanceStage(user.email)
      await fetchData()
    } catch (err) {
      console.error("Advance stage failed:", err)
      setError("Failed to advance stage.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        {error || "No data available."}
      </div>
    )
  }

  const completedTasks = data.timeline.flatMap(s => s.tasks).filter(t => t.is_completed).length
  const totalTasks = data.timeline.flatMap(s => s.tasks).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crop Lifecycle Tracker</h2>
          <p className="text-muted-foreground uppercase">
            {data.crop} • Started {new Date(data.sowing_date).toLocaleDateString()}
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
                <p className="text-2xl font-bold text-primary">Day {data.day_count}</p>
                <p className="text-sm text-muted-foreground">Current Day</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{data.total_days - data.day_count}</p>
                <p className="text-sm text-muted-foreground">Days Left</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${data.progress_percentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Next Steps Summary */}
      {data.ai_summary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Summary: What to do next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {data.ai_summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {data.timeline.map((stage: any) => {
          const Icon = stageIcons[stage.id] || Leaf
          return (
            <Card
              key={stage.id}
              className={`border-border/50 transition-all ${stage.status === "current" ? "border-primary/50 shadow-lg" : ""
                }`}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stage.status === "completed"
                    ? "bg-primary text-primary-foreground"
                    : stage.status === "current"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {stage.status === "completed" ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
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
                  <p className="text-sm text-muted-foreground">{stage.date}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setChatStage({ id: stage.id, label: stage.label })}
                    className="gap-2 text-primary hover:bg-primary/10"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Talk to AI
                  </Button>
                  {stage.status === "current" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAdvanceStage}
                      disabled={loading}
                      className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary"
                    >
                      Move to Next Stage
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {stage.ai_summary && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground border border-primary/10">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    <p className="italic">{stage.ai_summary}</p>
                  </div>
                )}
                <div className="space-y-3">
                  {stage.tasks.map((task: any) => (
                    <button
                      key={task.id}
                      disabled={toggling === task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${task.is_completed
                        ? "border-primary/20 bg-primary/5"
                        : "border-border bg-background hover:border-primary/50"
                        }`}
                    >
                      {task.is_completed ? (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : stage.status === "current" ? (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                          {toggling === task.id ? (
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          ) : (
                            <Circle className="h-3 w-3 text-primary opacity-0 transition-opacity hover:opacity-100" />
                          )}
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                          <Clock className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      )}
                      <span
                        className={
                          task.is_completed ? "text-muted-foreground line-through flex-1" : "flex-1"
                        }
                      >
                        {task.task_name}
                      </span>
                    </button>
                  ))}
                  {stage.tasks.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No specific tasks defined for this stage.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {chatStage && (
        <StageChatDrawer
          isOpen={!!chatStage}
          onClose={() => setChatStage(null)}
          stageId={chatStage.id}
          stageLabel={chatStage.label}
          cropType={data.crop}
        />
      )}
    </div>
  )
}

