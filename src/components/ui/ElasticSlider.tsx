"use client"

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react"
import type { KeyboardEvent, PointerEvent, ReactNode } from "react"
import { useRef, useState } from "react"

interface ElasticSliderProps {
  value?: number
  defaultValue?: number
  startingValue?: number
  maxValue?: number
  className?: string
  isStepped?: boolean
  stepSize?: number
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onChange?: (value: number) => void
  ariaLabel?: string
}

const MAX_OVERFLOW = 50

function decay(value: number, max: number) {
  if (max === 0) return 0
  const entry = value / max
  return 2 * (1 / (1 + Math.exp(-entry)) - 0.5) * max
}

export function ElasticSlider({
  value,
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon,
  rightIcon,
  onChange,
  ariaLabel = "Adjust value",
}: ElasticSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue
  const sliderRef = useRef<HTMLDivElement>(null)
  const clientX = useMotionValue(0)
  const overflow = useMotionValue(0)
  const scale = useMotionValue(1)
  const [region, setRegion] = useState<"left" | "middle" | "right">("middle")

  useMotionValueEvent(clientX, "change", (latest) => {
    const element = sliderRef.current
    if (!element) return
    const { left, right } = element.getBoundingClientRect()
    const distance = latest < left ? left - latest : latest > right ? latest - right : 0
    setRegion(latest < left ? "left" : latest > right ? "right" : "middle")
    overflow.jump(decay(distance, MAX_OVERFLOW))
  })

  const setSliderValue = (nextValue: number) => {
    const clamped = Math.min(Math.max(nextValue, startingValue), maxValue)
    const next = isStepped ? Math.round(clamped / stepSize) * stepSize : clamped
    const rounded = Number(next.toFixed(2))
    if (value === undefined) setInternalValue(rounded)
    onChange?.(rounded)
  }

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const element = sliderRef.current
    if (!element || event.buttons === 0) return
    const { left, width } = element.getBoundingClientRect()
    const next = startingValue + ((event.clientX - left) / width) * (maxValue - startingValue)
    setSliderValue(next)
    clientX.jump(event.clientX)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = isStepped ? stepSize : (maxValue - startingValue) / 100
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault()
      setSliderValue(currentValue - step)
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault()
      setSliderValue(currentValue + step)
    }
    if (event.key === "Home") setSliderValue(startingValue)
    if (event.key === "End") setSliderValue(maxValue)
  }

  const percentage = maxValue === startingValue
    ? 0
    : ((currentValue - startingValue) / (maxValue - startingValue)) * 100

  return (
    <div className={`elastic-slider ${className}`}>
      <motion.div
        className="elastic-slider__wrapper"
        onHoverStart={() => animate(scale, 1.04)}
        onHoverEnd={() => animate(scale, 1)}
        onTouchStart={() => animate(scale, 1.04)}
        onTouchEnd={() => animate(scale, 1)}
        style={{ scale, opacity: useTransform(scale, [1, 1.04], [0.82, 1]) }}
      >
        <motion.span className="elastic-slider__icon" animate={{ scale: region === "left" ? [1, 1.16, 1] : 1 }} style={{ x: useTransform(() => region === "left" ? -overflow.get() / scale.get() : 0) }}>
          {leftIcon}
        </motion.span>
        <div
          ref={sliderRef}
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuemin={startingValue}
          aria-valuemax={maxValue}
          aria-valuenow={currentValue}
          className="elastic-slider__root"
          onPointerMove={updateFromPointer}
          onPointerDown={(event) => {
            updateFromPointer(event)
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerUp={() => animate(overflow, 0, { type: "spring", bounce: 0.5 })}
          onPointerCancel={() => animate(overflow, 0, { type: "spring", bounce: 0.5 })}
          onLostPointerCapture={() => animate(overflow, 0, { type: "spring", bounce: 0.5 })}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="elastic-slider__track-wrapper"
            style={{
              scaleX: useTransform(() => {
                const width = sliderRef.current?.getBoundingClientRect().width ?? 1
                return 1 + overflow.get() / width
              }),
              scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
              transformOrigin: useTransform(() => {
                const left = sliderRef.current?.getBoundingClientRect().left ?? 0
                const width = sliderRef.current?.getBoundingClientRect().width ?? 1
                return clientX.get() < left + width / 2 ? "right" : "left"
              }),
              height: useTransform(scale, [1, 1.04], [6, 7]),
              marginTop: useTransform(scale, [1, 1.04], [0, -0.5]),
              marginBottom: useTransform(scale, [1, 1.04], [0, -0.5]),
            }}
          >
            <div className="elastic-slider__track">
              <div className="elastic-slider__range" style={{ width: `${percentage}%` }} />
            </div>
          </motion.div>
        </div>
        <motion.span className="elastic-slider__icon" animate={{ scale: region === "right" ? [1, 1.16, 1] : 1 }} style={{ x: useTransform(() => region === "right" ? overflow.get() / scale.get() : 0) }}>
          {rightIcon}
        </motion.span>
      </motion.div>
    </div>
  )
}
