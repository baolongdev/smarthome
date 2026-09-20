"use client"

import { getDeviceIconBg, getDeviceIconColor } from "@/lib/deviceHelpers"
import type { Device } from "@/lib/types"

interface DeviceIconProps {
  device: Device
  size?: number
}

export function DeviceIcon({ device, size = 40 }: DeviceIconProps) {
  const iconColor = getDeviceIconColor(device)
  const bgColor = getDeviceIconBg(device)

  const renderIcon = () => {
    const iconSize = size * 0.44
    return (
      <span
        className="flex items-center justify-center"
        style={{ width: iconSize, height: iconSize }}
      >
        <span style={{ fontSize: iconSize }}>{device.icon}</span>
      </span>
    )
  }

  return (
    <div
      className="flex items-center justify-center rounded-full transition-all duration-200"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        color: iconColor,
      }}
    >
      {renderIcon()}
    </div>
  )
}
