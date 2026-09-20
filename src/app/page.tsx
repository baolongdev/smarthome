"use client"

import { AppShell } from "@/components/AppShell"
import { RoomTabs } from "@/components/RoomTabs"
import { RoomGroup } from "@/components/RoomGroup"
import { QuickScenes } from "@/components/QuickScenes"
import { RoomManagementPanel } from "@/components/RoomManagementPanel"
import { DevicesView, RoomsView, ScenesView } from "@/components/ModeViews"
import { useStore } from "@/store/useStore"
import type { Device } from "@/lib/types"

export default function HomePage() {
  const { devices, rooms, roomOrder, selectedMode, scenes, sceneOrder } = useStore()

  const sortedRooms = roomOrder
    .map((id) => rooms[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)

  const roomDevices = (roomId: string): Device[] =>
    Object.values(devices).filter(
      (d) => d.roomId === roomId && d.type !== "sensor"
    )

  const sensors = Object.values(devices).filter((d) => d.type === "sensor")
  const orderedScenes = sceneOrder
    .map((id) => scenes[id])
    .filter(Boolean)

  return (
    <AppShell>
      {selectedMode === "settings" && <RoomManagementPanel />}
      {selectedMode === "rooms" && <RoomsView rooms={sortedRooms} devices={devices} />}
      {selectedMode === "devices" && <DevicesView devices={Object.values(devices)} />}
      {selectedMode === "scenes" && <ScenesView scenes={orderedScenes} />}
      {selectedMode === "home" && (
        <>
          <RoomTabs rooms={sortedRooms} />

          {sortedRooms.map((room) => (
            <RoomGroup key={room.id} room={room} devices={roomDevices(room.id)} />
          ))}

          {sensors.length > 0 && (
            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-xs font-medium uppercase leading-4 tracking-wider text-text-tertiary">Sensors</h2>
                <span className="text-xs text-text-muted">{sensors.length} active</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {sensors.map((sensor) => (
                  <button
                    key={sensor.id}
                    type="button"
                    onClick={() => useStore.getState().selectDevice(sensor.id)}
                    className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-bg-device-off px-3 py-2 text-left transition-colors hover:border-border-input hover:bg-bg-elevated"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated text-sm">{sensor.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium leading-4 text-text-secondary">{sensor.name}</span>
                      <span className="block text-xs leading-4 text-text-tertiary">
                      {sensor.subtype === "temperature"
                        ? `${sensor.state.temperature ?? 22}°C`
                        : sensor.subtype === "humidity"
                          ? `${sensor.state.humidity ?? 68}%`
                          : sensor.state.connection === "connected" ? "Connected" : "Unavailable"}
                      </span>
                    </span>
                    <span className={`size-2 shrink-0 rounded-full ${sensor.online ? "bg-success" : "bg-danger"}`} />
                  </button>
                ))}
              </div>
            </section>
          )}

          <QuickScenes scenes={[]} />
        </>
      )}
    </AppShell>
  )
}
