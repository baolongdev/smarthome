"use client"

import { useStore } from "@/store/useStore"

interface CurtainControlProps {
  deviceId: string
}

export function CurtainControl({ deviceId }: CurtainControlProps) {
  const { devices, setCurtainPosition } = useStore()
  const device = devices[deviceId]
  if (!device) return null

  const position = device.state.position ?? 0
  const isOn = device.state.power

  const handlePositionChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newPosition = Math.round((x / rect.width) * 100)
    setCurtainPosition(deviceId, newPosition)
  }

  const handleOpen = () => setCurtainPosition(deviceId, 100)
  const handleClose = () => setCurtainPosition(deviceId, 0)
  const handlePause = () => setCurtainPosition(deviceId, position)

  if (!isOn && position === 0) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleOpen}
            className="flex-1 py-2 px-4 rounded-lg border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-elevated transition-all"
          >
            Open
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-2 px-4 rounded-lg border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-elevated transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleOpen}
          className="flex-1 py-2 px-4 rounded-lg border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-elevated transition-all"
        >
          Open
        </button>
        <button
          onClick={handlePause}
          className="flex-1 py-2 px-4 rounded-lg border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-elevated transition-all"
        >
          Pause
        </button>
        <button
          onClick={handleClose}
          className="flex-1 py-2 px-4 rounded-lg border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-elevated transition-all"
        >
          Close
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-text-tertiary">Position</span>
          <span className="text-xs font-medium text-text-primary">{position}%</span>
        </div>

        <div
          className="relative h-1.5 rounded-full bg-bg-device-off cursor-pointer"
          onMouseDown={handlePositionChange}
          onClick={handlePositionChange}
        >
          <div
            className="absolute top-0 h-full rounded-full bg-accent transition-all duration-150"
            style={{ width: `${position}%` }}
          />
        </div>
      </div>
    </div>
  )
}
