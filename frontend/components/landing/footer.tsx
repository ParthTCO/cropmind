import Link from "next/link"
import { Leaf } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">CropMind AI</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © 2025 CropMind AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
