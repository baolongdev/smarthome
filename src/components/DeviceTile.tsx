"use client"

import { Power } from "lucide-react"
import type { Device } from "@/lib/types"
import { getDeviceStateText, getDeviceOpacity, getDeviceTileBg } from "@/lib/deviceHelpers"
import { DeviceIcon } from "./DeviceIcon"
import { useStore } from "@/store/useStore"

interface DeviceTileProps {
  device: Device
  variant?: "compact" | "wide" | "sensor"
  onToggle?: () => void
  onOpen?: () => void
}

export function DeviceTile({ device, variant = "compact", onToggle, onOpen }: DeviceTileProps) {
  const { selectDevice, toggleDevice } = useStore()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggle) {
      onToggle()
    } else {
      toggleDevice(device.id)
    }
  }

  const handleOpen = () => {
    onOpen?.()
    selectDevice(device.id)
  }

  const tileBg = getDeviceTileBg(device)
  const opacity = getDeviceOpacity(device)
  const stateText = getDeviceStateText(device)
  const isOn = device.state.power
  const isSensor = device.type === "sensor"

  return (
    <button
      onClick={handleOpen}
      className={`
        group relative
        w-full
        rounded-[var(--radius-tile)]
        transition-all duration-200 ease-out
        active:scale-[0.98]
        grid items-center
        grid-cols-[42px_1fr_44px]
        gap-3
        px-3
        h-[78px]
      `}
      style={{
        backgroundColor: tileBg,
        opacity,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full transition-all duration-200 col-start-1 col-span-1"
        style={{ width: 42, height: 42 }}
      >
        <DeviceIcon device={device} size={36} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center col-start-2 col-span-1">
        <div className="flex items-center gap-2">
          <span
            className={`
              text-sm font-medium leading-5 truncate
              ${isOn ? "text-text-primary" : "text-text-device-off"}
            `}
          >
            {device.name}
          </span>

          {!device.online && (
            <span className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
          )}
        </div>

        {variant !== "sensor" && (
          <span
            className={`
              text-xs leading-4
              ${isOn ? "text-text-secondary" : "text-text-device-off-secondary"}
            `}
          >
            {stateText}
          </span>
        )}

        {isSensor && device.subtype && (
            <span className="text-xs leading-4 text-text-tertiary">
            {device.subtype.charAt(0).toUpperCase() + device.subtype.slice(1)}
          </span>
        )}
      </div>

      {!isSensor && (
        <div
          onClick={handleToggle}
          className={`
            col-start-3 col-span-1
            flex items-center justify-center
            w-10 h-10 rounded-xl
            border border-border
            transition-all duration-200 ease-out
            hover:border-accent
            ${
              isOn
                ? "bg-accent text-bg-primary hover:bg-accent/90"
                : "bg-transparent text-text-secondary hover:text-text-primary hover:bg-elevated"
            }
          `}
        >
          <Power size={14} strokeWidth={isOn ? 2.5 : 1.5} />
        </div>
      )}
    </button>
  )
}
