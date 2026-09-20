"use client"

import type { Device } from "@/lib/types"

interface ConnectionIndicatorProps {
  device: Device
  size?: "sm" | "md"
}

export function ConnectionIndicator({ device, size = "md" }: ConnectionIndicatorProps) {
  const isOnline = device.online
  const isConnected = device.connected
  const connection = device.state.connection

  let dotColor = "bg-success"
  let label = "Online"

  if (!isOnline) {
    dotColor = "bg-danger"
    label = "Offline"
  } else if (!isConnected) {
    dotColor = "bg-warning"
    label = "Connecting"
  } else if (connection === "reconnecting") {
    dotColor = "bg-warning"
    label = "Reconnecting"
  }

  const sizeClass = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"

  return (
    <div className="flex items-center gap-1.5">
      <span className={`${sizeClass} rounded-full ${dotColor} flex-shrink-0`} />
      <span className="text-xs text-text-tertiary">{label}</span>
    </div>
  )
}
