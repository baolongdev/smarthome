"use client"

import type { DeviceState } from "@/lib/types"
import { useStore } from "@/store/useStore"

interface ModeSelectorProps {
  deviceId: string
  currentMode?: DeviceState["mode"]
  options: Array<{ value: DeviceState["mode"]; label: string; icon: React.ReactNode }>
}

export function ModeSelector({ deviceId, currentMode = "auto", options }: ModeSelectorProps) {
  const { setMode } = useStore()

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isActive = currentMode === option.value
        return (
          <button
            key={option.value ?? "auto"}
            onClick={() => option.value && setMode(deviceId, option.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5
              rounded-lg border text-xs font-medium
              transition-all duration-150
              ${
                isActive
                  ? "border-accent text-accent"
                  : "border-border text-text-secondary hover:text-text-primary hover:bg-elevated"
              }
            `}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
