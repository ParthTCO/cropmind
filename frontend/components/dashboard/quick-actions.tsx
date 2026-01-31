import Link from "next/link"
import { AlertCircle, MessageSquare, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
  {
    icon: AlertCircle,
    title: "Report Symptom",
    description: "Noticed something unusual? Report pest or disease symptoms.",
    href: "/chat",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: MessageSquare,
    title: "Ask AI Now",
    description: "Get instant answers to any farming question.",
    href: "/chat",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Bell,
    title: "View Alerts",
    description: "Check weather warnings and important notifications.",
    href: "/alerts",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
]

export function QuickActions() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className="group flex h-full flex-col rounded-xl border border-border p-4 transition-all hover:border-primary/50 hover:shadow-md">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {action.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full justify-start p-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Get Started →
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
