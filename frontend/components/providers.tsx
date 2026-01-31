"use client"

import React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
        >
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    )
}
