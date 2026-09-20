"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function CountUp({
  end,
  start = 0,
  duration = 1.2,
  suffix = "",
  prefix = "",
  decimals = 0,
}: CountUpProps) {
  const [value, setValue] = useState(start)
  const ref = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (prefersReduced.matches) {
      requestAnimationFrame(() => setValue(end))
      return
    }

    const startTime = performance.now()
    const total = end - start

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      if (progress >= 1) {
        setValue(end)
        return
      }

      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      const current = start + total * easeOutExpo

      setValue(current)
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, start, duration])

  const displayValue =
    decimals > 0
      ? value.toFixed(Math.max(0, Math.floor(decimals)))
      : Math.round(value).toString()

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
