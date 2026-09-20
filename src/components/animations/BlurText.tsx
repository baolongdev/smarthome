"use client"

import { cn } from "@/lib/utils"

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export function BlurText({ text, className, delay = 0, duration = 0.4 }: BlurTextProps) {
  return (
    <span
      className={cn("blur-text-animation", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}s`,
      }}
    >
      {text}
    </span>
  )
}
