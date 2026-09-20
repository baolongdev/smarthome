import type { Device } from "@/lib/types"

export function getDeviceIconColor(device: Device): string {
  if (!device.online || device.state.connection === "disconnected") {
    return "#686870"
  }

  if (!device.state.power) {
    return "#9A9AA2"
  }

  switch (device.type) {
    case "light":
      return "#FFD84A"
    case "ac":
      return "#35D0F4"
    case "fan":
      return "#36CFF4"
    case "curtain":
    case "tv":
    case "speaker":
      return "#F5F5F7"
    case "plug":
      return "#50D890"
    case "lock":
      return "#F5A524"
    case "camera":
      return "#FF5F62"
    case "sensor":
      return "#F5F5F7"
    default:
      return "#F5F5F7"
  }
}

export function getDeviceIconBg(device: Device): string {
  if (!device.state.power) {
    return "#34343B"
  }

  switch (device.type) {
    case "light":
      return "rgba(255, 216, 74, 0.18)"
    case "ac":
    case "fan":
      return "rgba(54, 207, 244, 0.12)"
    default:
      return "rgba(255, 255, 255, 0.10)"
  }
}

export function getDeviceTileBg(device: Device): string {
  if (!device.online) {
    return "rgba(24, 24, 30, 0.55)"
  }

  if (device.state.power) {
    return "rgba(255, 255, 255, 0.19)"
  }

  return "#18181E"
}

export function getDeviceOpacity(device: Device): number {
  if (!device.online) return 0.55
  return 1
}

export function getDeviceStateColor(device: Device): string {
  if (!device.online) return "#686870"
  if (device.state.connection === "reconnecting") return "#F5A524"
  return "#50D890"
}

export function getRoomBg(): string {
  return "#1A1A20"
}

export function formatLastSeen(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString()
}

export function getDeviceStateText(device: Device): string {
  if (!device.online) return "Offline"
  if (device.state.connection === "reconnecting") return "Reconnecting..."

  switch (device.type) {
    case "ac":
      if (!device.state.power) return "Off"
      return `${device.state.mode ?? "Auto"} · ${device.state.temperature ?? 24}°C`
    case "light":
      if (!device.state.power) return "Off"
      return `${device.state.brightness ?? 0}%`
    case "fan":
      if (!device.state.power) return "Off"
      return device.state.fanSpeed ?? "Auto"
    case "curtain":
      if (!device.state.power) return "Closed"
      return `${device.state.position ?? 0}% Open`
    case "tv":
      if (!device.state.power) return "Off"
      return `Ch ${device.state.channel ?? "01"}`
    case "speaker":
      if (!device.state.power) return "Off"
      return `${device.state.volume ?? 0}%`
    case "plug":
      if (!device.state.power) return "Off"
      return `${device.powerConsumption} W`
    case "lock":
      return device.state.locked ? "Locked" : "Unlocked"
    case "camera":
      if (!device.state.power) return "Off"
      return "Recording"
    case "sensor":
      if (device.subtype === "temperature") return `${device.state.temperature ?? 22}°C`
      if (device.subtype === "humidity") return "68%"
      return "Active"
    default:
      return device.state.power ? "On" : "Off"
  }
}

export function getDeviceSecondaryText(device: Device): string | null {
  if (!device.online) return "Offline"

  if (device.state.power && device.type === "light") {
    const temp = device.state.brightness
    if (temp !== undefined) return `${temp}%`
  }

  if (device.type === "ac" && device.state.power) {
    return `${device.state.mode ?? "auto"} · ${device.state.temperature ?? 24}°C`
  }

  if (device.type === "fan" && device.state.power) {
    return device.state.fanSpeed ?? "Auto"
  }

  if (device.type === "curtain" && device.state.power) {
    return `${device.state.position ?? 0}% Open`
  }

  if (device.type === "tv" && device.state.power) {
    return `Ch ${device.state.channel ?? "01"} • ${device.state.volume ?? 0}%`
  }

  return null
}
