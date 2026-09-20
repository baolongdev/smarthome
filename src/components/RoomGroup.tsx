"use client"

import type { Device, Room } from "@/lib/types"
import { DeviceTile } from "./DeviceTile"
import { FadeContent } from "./animations/FadeContent"

interface RoomGroupProps {
  room: Room
  devices: Device[]
}

export function RoomGroup({ room, devices }: RoomGroupProps) {
  if (devices.length === 0) {
    return (
      <div id={`room-${room.id}`} className="room-section mb-6">
        <h2 className="mb-3 px-1 text-sm font-medium leading-5 text-text-primary">{room.name}</h2>
        <div
          className="
            rounded-[var(--radius-room)]
            bg-bg-room-group border border-border-room
            p-6 flex flex-col items-center justify-center
            text-center
          "
        >
          <p className="text-sm leading-5 text-text-secondary">No devices in this room</p>
          <button className="mt-2 rounded-lg border border-border px-4 py-1.5 text-xs font-medium leading-4 text-text-primary transition-colors hover:bg-elevated">
            Add Device
          </button>
        </div>
      </div>
    )
  }

  return (
    <FadeContent delay={100} duration={0.25}>
      <div id={`room-${room.id}`} className="room-section mb-6">
        <h2 className="mb-3 px-1 text-sm font-medium leading-5 text-text-primary">{room.name}</h2>

        <div
          className="
            group rounded-[var(--radius-room)]
            bg-bg-room-group border border-border-room
            p-2
            grid gap-2
            sm:grid-cols-1
            lg:grid-cols-2
          "
        >
          {devices.map((device, idx) => (
            <FadeContent key={device.id} delay={100 + idx * 40} duration={0.2}>
              <DeviceTile
                device={device}
                variant={device.type === "sensor" ? "sensor" : "compact"}
              />
            </FadeContent>
          ))}
        </div>
      </div>
    </FadeContent>
  )
}
