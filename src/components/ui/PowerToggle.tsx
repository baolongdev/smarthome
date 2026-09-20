"use client"

import { Power } from "lucide-react"
import { useStore } from "@/store/useStore"

interface PowerToggleProps {
  deviceId: string
  size?: "sm" | "md" | "lg"
}

export function PowerToggle({ deviceId, size = "md" }: PowerToggleProps) {
  const { devices, toggleDevice } = useStore()
  const device = devices[deviceId]
  if (!device) return null

  const isOn = device.state.power
  const sizeClasses = {
    sm: "w-16 h-10",
    md: "w-20 h-12",
    lg: "w-24 h-12",
  }
  const iconSize = size === "sm" ? 12 : size === "md" ? 14 : 16

  return (
    <button
      onClick={() => toggleDevice(deviceId)}
      className={`
        relative flex items-center justify-between
        ${sizeClasses[size]}
        px-3 rounded-full
        border border-input
        transition-all duration-200 ease-out
        active:scale-[0.97]
        ${
          isOn
            ? "bg-bg-elevated"
            : "bg-bg-device-off border-border"
        }
      `}
    >
      <span
        className={`
          absolute top-1.5 left-1.5
          w-3 h-3 rounded-full
          transition-transform duration-200
          ${isOn ? "translate-x-9 bg-success" : "bg-text-tertiary"}
        `}
      />
      <span className="z-10">
        <Power size={iconSize} className="text-text-secondary" />
      </span>
      <span className="z-10">
        <Power size={iconSize} className={isOn ? "text-accent" : "text-text-tertiary"} />
      </span>
    </button>
  )
}
