"use client"

import { ThermometerIcon, WindIcon, SnowflakeIcon, DropletIcon } from "@/components/icons"
import type { ComponentType } from "react"
import { useStore } from "@/store/useStore"

interface TemperatureControlProps {
  deviceId: string
  compact?: boolean
  fanSpeedOnly?: boolean
}

type ModeIconComponent = ComponentType<{ size?: number; className?: string }>

const modeIcons: Record<string, ModeIconComponent> = {
  cool: SnowflakeIcon as ModeIconComponent,
  heat: ThermometerIcon as ModeIconComponent,
  fan: WindIcon as ModeIconComponent,
  dry: DropletIcon as ModeIconComponent,
  auto: ThermometerIcon as ModeIconComponent,
}

const fanSpeeds = ["auto", "low", "medium", "high"] as const

export function TemperatureControl({ deviceId, compact = false, fanSpeedOnly = false }: TemperatureControlProps) {
  const { devices, setTemperature, setFanSpeed } = useStore()
  const device = devices[deviceId]
  if (!device) return null

  const temperature = device.state.temperature ?? 24
  const fanSpeed = device.state.fanSpeed ?? "auto"
  const ModeIcon = modeIcons[device.state.mode ?? "auto"] ?? ThermometerIcon

  const handleTempChange = (delta: number) => {
    const newTemp = Math.max(16, Math.min(30, temperature + delta))
    setTemperature(deviceId, newTemp)
  }

  const renderFanSpeedButtons = () =>
    fanSpeeds.map((speed) => {
      const isActive = fanSpeed === speed
      return (
        <button
          key={speed}
          onClick={() => setFanSpeed(deviceId, speed)}
          className={`
            px-3 py-1.5 rounded-lg
            text-xs font-medium
            transition-all
            ${isActive
              ? "bg-accent text-bg-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-elevated"
            }
          `}
        >
          {speed.charAt(0).toUpperCase() + speed.slice(1)}
        </button>
      )
    })

  if (fanSpeedOnly) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {renderFanSpeedButtons()}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-text-secondary">Fan Speed</span>
          <span className="text-xs font-medium text-text-primary capitalize">
            {fanSpeed}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {renderFanSpeedButtons()}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ModeIcon size={16} className="text-text-tertiary" />
        {renderFanSpeedButtons()}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">Temperature</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTempChange(-1)}
            className="w-7 h-7 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-elevated transition-all flex items-center justify-center"
          >
            −
          </button>
          <span className="text-xl font-medium text-text-primary">{temperature}°C</span>
          <button
            onClick={() => handleTempChange(1)}
            className="w-7 h-7 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-elevated transition-all flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
