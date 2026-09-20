"use client"

import { WifiIcon, ThermometerIcon, DropletIcon, ZapIcon } from "@/components/icons"
import { useStore } from "@/store/useStore"
import { ShinyText } from "./animations/ShinyText"

export function SystemStatus() {
  const { systemInfo, devices, rooms } = useStore()

  const deviceList = Object.values(devices)
  const activeDevices = deviceList.filter((device) => device.state.power).length
  const onlineDevices = deviceList.filter((device) => device.online).length

  const statusColor =
    systemInfo.status === "online"
      ? "bg-success"
      : systemInfo.status === "degraded"
        ? "bg-warning"
        : "bg-danger"

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusColor} flex-shrink-0`} />
            <ShinyText text={`Local System · ${systemInfo.status === "online" ? "Online" : systemInfo.status}`} className="truncate text-xs" color="#96969f" shineColor="#ffd84a" />
        </div>
        <ShinyText text={systemInfo.mqttConnected ? "MQTT" : "Local"} className="shrink-0 text-[11px]" speed={3} color="#62626b" shineColor="#f5f5f7" />
      </div>

      <div className="flex items-center gap-2 px-1" title={`Local IP: ${systemInfo.localIp}`}>
        <WifiIcon size={14} className="text-text-tertiary" />
        <ShinyText text={`IP: ${systemInfo.localIp}`} className="truncate text-xs" speed={3.2} color="#62626b" shineColor="#ffd84a" />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <ThermometerIcon size={14} className="shrink-0 text-text-tertiary" />
          <div className="min-w-0">
            <span className="block text-[11px] leading-4 text-text-muted">Climate</span>
            <ShinyText text="26° · 68%" className="text-xs font-medium" color="#96969f" shineColor="#ffd84a" speed={3.5} />
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <ZapIcon size={14} className="shrink-0 text-text-tertiary" />
          <div className="min-w-0">
            <span className="block text-[11px] leading-4 text-text-muted">Energy</span>
            <ShinyText text="0.4 kWh" className="text-xs font-medium" color="#96969f" shineColor="#ffd84a" speed={3.5} />
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <WifiIcon size={14} className="shrink-0 text-text-tertiary" />
          <div className="min-w-0">
            <span className="block text-[11px] leading-4 text-text-muted">Devices</span>
            <ShinyText text={`${onlineDevices}/${deviceList.length} online`} className="text-xs font-medium" color="#96969f" shineColor="#50d890" speed={3.5} />
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <DropletIcon size={14} className="shrink-0 text-text-tertiary" />
          <div className="min-w-0">
            <span className="block text-[11px] leading-4 text-text-muted">Rooms</span>
            <ShinyText text={`${Object.keys(rooms).length} · ${activeDevices} on`} className="text-xs font-medium" color="#96969f" shineColor="#ffd84a" speed={3.5} />
          </div>
        </div>
      </div>
    </div>
  )
}
