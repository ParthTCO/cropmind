import { Zap, ArrowRight, Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TodayActionCardProps {
  action?: string;
  details?: string;
  tags?: string[];
  updatedAt?: string;
  loading?: boolean;
}

export function TodayActionCard({
  action = "Loading...",
  details = "",
  tags = [],
  updatedAt = "Just now",
  loading = false
}: TodayActionCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-primary">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          Today&apos;s Most Important Action
        </CardTitle>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {updatedAt}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-6 bg-muted rounded w-24"></div>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold">{action}</h3>
            <p className="mt-2 text-muted-foreground">
              {details || "No specific action details available at this time."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${index === 0
                        ? "bg-primary/10 text-primary"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  AI Recommendation
                </span>
              )}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="gap-2 rounded-lg bg-transparent">
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

