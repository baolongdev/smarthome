"use client"

import { SunIcon, MoonIcon } from "@/components/icons"
import { Volume1, Volume2 } from "lucide-react"
import { useStore } from "@/store/useStore"
import { ElasticSlider } from "./ElasticSlider"

interface BrightnessControlProps {
  deviceId: string
  showLabel?: boolean
  mode?: "brightness" | "volume"
}

export function BrightnessControl({ deviceId, showLabel = true, mode = "brightness" }: BrightnessControlProps) {
  const { devices, setBrightness, setVolume } = useStore()
  const device = devices[deviceId]
  if (!device) return null

  const brightness = mode === "volume" ? device.state.volume ?? 0 : device.state.brightness ?? 0
  const maxBrightness = 100

  const percent = maxBrightness > 0 ? Math.round((brightness / maxBrightness) * 100) : 0

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary">{mode === "volume" ? "Volume" : "Brightness"}</span>
          <span className="text-sm font-medium text-text-primary">{percent}%</span>
        </div>
      )}

      <ElasticSlider
        value={brightness}
        maxValue={maxBrightness}
        isStepped
        stepSize={1}
        ariaLabel="Brightness"
        leftIcon={mode === "volume" ? <Volume1 size={13} /> : <SunIcon size={12} />}
        rightIcon={mode === "volume" ? <Volume2 size={13} /> : <MoonIcon size={12} />}
        onChange={(nextValue) => mode === "volume" ? setVolume(deviceId, nextValue) : setBrightness(deviceId, nextValue)}
      />
    </div>
  )
}
