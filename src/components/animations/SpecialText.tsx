"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SpecialTextProps {
  children: ReactNode
  className?: string
  effect?: "reveal" | "shimmer" | "soft"
}

export function SpecialText({ children, className, effect = "reveal" }: SpecialTextProps) {
  return (
    <span className={cn("special-text", `special-text-${effect}`, className)}>
      {children}
    </span>
  )
}
