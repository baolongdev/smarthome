"use client"

import { useEffect, useState } from "react"
import { ShinyText } from "./animations/ShinyText"

interface ClockWidgetProps {
  compact?: boolean
}

export function ClockWidget({ compact = false }: ClockWidgetProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-medium text-text-primary">{timeStr}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <ShinyText text={timeStr} color="#f5f5f7" shineColor="#ffd84a" className="text-3xl font-medium leading-tight" />
      <span className="text-sm text-text-tertiary">{dateStr}</span>
    </div>
  )
}
