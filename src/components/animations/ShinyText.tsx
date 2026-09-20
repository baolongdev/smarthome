"use client"

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

interface ShinyTextProps {
  text: string
  color?: string
  shineColor?: string
  speed?: number
  delay?: number
  spread?: number
  yoyo?: boolean
  pauseOnHover?: boolean
  direction?: "left" | "right"
  disabled?: boolean
  className?: string
}

export function ShinyText({ text, color = "#96969f", shineColor = "#ffffff", speed = 2.4, delay = 0.4, spread = 120, yoyo = false, pauseOnHover = false, direction = "left", disabled = false, className = "" }: ShinyTextProps) {
  const [isPaused, setIsPaused] = useState(false)
  const reduce = useReducedMotion()
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const directionRef = useRef(direction === "left" ? 1 : -1)
  const backgroundPosition = useTransform(progress, (value) => `${150 - value * 2}% center`)

  useEffect(() => {
    directionRef.current = direction === "left" ? 1 : -1
    elapsedRef.current = 0
    progress.set(0)
  }, [direction, progress])

  useAnimationFrame((time) => {
    if (disabled || reduce || isPaused) {
      lastTimeRef.current = null
      return
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
      return
    }

    const animationDuration = speed * 1000
    const cycleDuration = animationDuration + delay * 1000
    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time
    elapsedRef.current += deltaTime

    if (yoyo) {
      const cycleTime = elapsedRef.current % (cycleDuration * 2)
      const value = cycleTime < animationDuration
        ? (cycleTime / animationDuration) * 100
        : cycleTime < cycleDuration
          ? 100
          : 100 - ((cycleTime - cycleDuration) / animationDuration) * 100
      progress.set(directionRef.current === 1 ? value : 100 - value)
    } else {
      const cycleTime = elapsedRef.current % cycleDuration
      const value = cycleTime < animationDuration ? (cycleTime / animationDuration) * 100 : 100
      progress.set(directionRef.current === 1 ? value : 100 - value)
    }
  })

  const handleMouseEnter = useCallback(() => { if (pauseOnHover) setIsPaused(true) }, [pauseOnHover])
  const handleMouseLeave = useCallback(() => { if (pauseOnHover) setIsPaused(false) }, [pauseOnHover])

  return (
    <motion.span
      className={`shiny-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        backgroundPosition,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  )
}
