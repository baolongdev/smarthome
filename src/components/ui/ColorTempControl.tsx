"use client"

import { useStore } from "@/store/useStore"
import { ElasticSlider } from "./ElasticSlider"

interface ColorTempControlProps {
  deviceId: string
  kelvin?: number
}

export function ColorTempControl({ deviceId, kelvin = 4000 }: ColorTempControlProps) {
  const { devices, setDeviceState } = useStore()
  const device = devices[deviceId]
  if (!device) return null

  const currentTemp = device.state.temperature ? device.state.temperature * 100 : kelvin
  const temp = currentTemp || kelvin

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-xs text-text-tertiary">Color Temperature</span>
        <span className="text-xs font-medium text-text-primary">{temp}K</span>
      </div>
      <ElasticSlider
        value={temp}
        startingValue={2700}
        maxValue={6500}
        isStepped
        stepSize={100}
        ariaLabel="Color temperature"
        leftIcon={<span className="text-xs text-text-tertiary">2700K</span>}
        rightIcon={<span className="text-xs text-text-tertiary">6500K</span>}
        onChange={(nextValue) => setDeviceState(deviceId, { temperature: nextValue / 100 })}
      />
      <div className="flex justify-between">
        <span className="text-xs text-text-tertiary">2700K</span>
        <span className="text-xs text-text-tertiary">6500K</span>
      </div>
    </div>
  )
}
