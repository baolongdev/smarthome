"use client"

import { cn } from "@/lib/utils"

interface FadeContentProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeContent({ children, delay = 0, duration = 0.3, className }: FadeContentProps) {
  return (
    <div
      className={cn("fade-content-animation", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}
