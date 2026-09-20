"use client"

import { PowerToggle } from "@/components/ui/PowerToggle"
import { BrightnessControl } from "@/components/ui/BrightnessControl"
import { TemperatureControl } from "@/components/ui/TemperatureControl"
import { CurtainControl } from "@/components/ui/CurtainControl"
import { ModeSelector } from "@/components/ui/ModeSelector"
import { ColorTempControl } from "@/components/ui/ColorTempControl"
import { ConnectionIndicator } from "@/components/ui/ConnectionIndicator"
import { CountUp } from "./animations/CountUp"
import type { Device } from "@/lib/types"
import { useStore } from "@/store/useStore"
import { getDeviceIconColor } from "@/lib/deviceHelpers"
import { WindIcon, SnowflakeIcon, DropletIcon, ThermometerIcon } from "@/components/icons"

interface DeviceDetailPanelProps {
  device: Device
}

const acModes = [
  { value: "cool" as const, label: "Cool", icon: <SnowflakeIcon size={12} /> },
  { value: "dry" as const, label: "Dry", icon: <DropletIcon size={12} /> },
  { value: "fan" as const, label: "Fan", icon: <WindIcon size={12} /> },
  { value: "auto" as const, label: "Auto", icon: <ThermometerIcon size={12} /> },
]

export function DeviceDetailPanelContent({ device }: DeviceDetailPanelProps) {
  const iconColor = getDeviceIconColor(device)

  const renderControls = () => {
    switch (device.type) {
      case "ac":
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs leading-4 text-text-tertiary uppercase tracking-wider">
                Mode
              </label>
              <ModeSelector
                deviceId={device.id}
                currentMode={device.state.mode}
                options={acModes}
              />
            </div>

            <TemperatureControl deviceId={device.id} />

            <div>
              <label className="mb-2 block text-xs leading-4 text-text-tertiary uppercase tracking-wider">
                Fan Speed
              </label>
              <TemperatureControl deviceId={device.id} compact fanSpeedOnly />
            </div>

            <div className="pt-2 border-t border-border">
              <PowerToggle deviceId={device.id} size="md" />
            </div>
          </div>
        )

      case "light":
        return (
          <div className="space-y-5">
            <div>
              <BrightnessControl deviceId={device.id} />
            </div>
            <div>
              <ColorTempControl deviceId={device.id} kelvin={4000} />
            </div>
            <div className="pt-2 border-t border-border">
              <PowerToggle deviceId={device.id} size="md" />
            </div>
          </div>
        )

      case "fan":
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs leading-4 text-text-tertiary uppercase tracking-wider">
                Fan Speed
              </label>
              <TemperatureControl deviceId={device.id} compact fanSpeedOnly />
            </div>
            <div className="pt-2 border-t border-border">
              <PowerToggle deviceId={device.id} size="md" />
            </div>
          </div>
        )

      case "curtain":
        return (
          <div className="space-y-5">
            <CurtainControl deviceId={device.id} />
            <div className="pt-2 border-t border-border">
              <PowerToggle deviceId={device.id} size="md" />
            </div>
          </div>
        )

      case "tv":
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs leading-4 text-text-tertiary uppercase tracking-wider">
                Volume
              </label>
              <BrightnessControl deviceId={device.id} showLabel={false} mode="volume" />
            </div>
            <div className="pt-2 border-t border-border">
              <PowerToggle deviceId={device.id} size="md" />
            </div>
          </div>
        )

      case "speaker":
        return (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs leading-4 text-text-tertiary uppercase tracking-wider">
                Volume
              </label>
              <BrightnessControl deviceId={device.id} showLabel={false} mode="volume" />
            </div>
            <div className="pt-2 border-t border-border">
              <PowerToggle deviceId={device.id} size="md" />
            </div>
          </div>
        )

      case "plug":
        return (
          <div className="pt-2 border-t border-border">
            <PowerToggle deviceId={device.id} size="md" />
          </div>
        )

      case "lock":
        return (
          <div className="pt-2 border-t border-border">
            <PowerToggle deviceId={device.id} size="md" />
          </div>
        )

      case "sensor":
        return (
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Reading</span>
              <span className="text-sm font-medium text-text-primary">
                {device.subtype === "temperature"
                  ? `${device.state.temperature ?? "—"}°C`
                  : device.subtype === "humidity"
                    ? `${device.state.humidity ?? "—"}%`
                    : device.state.connection === "connected" ? "Connected" : "Unavailable"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">Last updated</span>
              <span className="text-xs text-text-secondary">{new Date(device.state.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        )

      default:
        return (
          <div className="pt-2 border-t border-border">
            <PowerToggle deviceId={device.id} size="md" />
          </div>
        )
    }
  }

  return (
    <div className="p-5 flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl" style={{ color: iconColor }}>
            {device.icon}
          </span>
          <h2 className="text-lg font-medium leading-6 text-text-primary">{device.name}</h2>
        </div>

        <ConnectionIndicator device={device} />
      </div>

      <div className="space-y-4">{renderControls()}</div>

      <div className="mt-auto pt-4 border-t border-border space-y-2">
        {device.powerConsumption > 0 && (
          <div className="flex justify-between">
            <span className="text-xs leading-4 text-text-tertiary">Power Usage</span>
            <span className="text-xs font-medium leading-4 text-text-primary">
              <CountUp end={device.powerConsumption} suffix=" W" duration={1.5} />
            </span>
          </div>
        )}
        {device.firmware && (
          <div className="flex justify-between">
            <span className="text-xs leading-4 text-text-tertiary">Firmware</span>
            <span className="text-xs font-medium leading-4 text-text-primary">
              {device.firmware}
            </span>
          </div>
        )}
        {device.brand && device.model && (
          <div className="flex justify-between">
            <span className="text-xs leading-4 text-text-secondary">Model</span>
            <span className="text-xs font-medium leading-4 text-text-secondary">
              {device.brand} {device.model}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function DeviceDetailPanel() {
  const { selectedDevice, devices, systemInfo, scenes, sceneOrder } = useStore()
  const device = selectedDevice ? devices[selectedDevice] : null

  const orderedScenes = sceneOrder
    .map((id) => scenes[id])
    .filter(Boolean)

  if (!device || !selectedDevice) {
    return (
      <div className="p-5 flex flex-col h-full">
        <div className="mb-6">
          <h3 className="mb-1 text-sm font-medium leading-5 text-text-primary">Dashboard</h3>
          <p className="text-xs leading-4 text-text-tertiary">System overview</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Current Climate
            </h4>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary">Temperature</span>
              <span className="text-xs font-medium text-text-primary">26°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary">Humidity</span>
              <span className="text-xs font-medium text-text-primary">68%</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
              Energy
            </h4>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary">Today</span>
              <span className="text-xs font-medium text-text-primary">
                <CountUp end={3.4} suffix=" kWh" duration={1.5} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary">Active Devices</span>
              <span className="text-xs font-medium text-text-primary">
                {Object.values(devices).filter((d) => d.state.power).length} on
              </span>
            </div>
          </div>

          {orderedScenes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Quick Actions
              </h4>
              <div className="flex flex-col gap-1">
                {orderedScenes.slice(0, 4).map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => {}}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-elevated transition-all text-left"
                  >
                    <span>{scene.icon}</span>
                    <span>{scene.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex justify-between">
            <span className="text-xs text-text-tertiary">
              {systemInfo.localIp}
            </span>
            <span className="text-xs text-text-tertiary">
              v{systemInfo.version}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return <DeviceDetailPanelContent device={device} />
}
