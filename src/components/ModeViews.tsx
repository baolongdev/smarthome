"use client"

import { useState } from "react"
import { Pencil, Save, Trash2, X } from "lucide-react"
import type { Device, Room, Scene } from "@/lib/types"
import { useStore } from "@/store/useStore"
import { DeviceTile } from "./DeviceTile"
import { QuickScenes } from "./QuickScenes"
import { RoomIcon } from "./RoomIcon"
import { RoomIconPicker } from "./RoomIconPicker"
import { SpecialText } from "./animations/SpecialText"

interface RoomsViewProps {
  rooms: Room[]
  devices: Record<string, Device>
}

export function RoomsView({ rooms, devices }: RoomsViewProps) {
  const { selectedRoom, selectRoom, updateRoom, removeRoom, removeDevice } = useStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("house")
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null)

  const selectedRoomData = rooms.find((room) => room.id === selectedRoom) ?? null
  const selectedDevices = selectedRoomData
    ? selectedRoomData.deviceIds.map((id) => devices[id]).filter(Boolean)
    : []

  const saveRoom = () => {
    const trimmedName = name.trim()
    if (!selectedRoomData || !trimmedName) return
    updateRoom(selectedRoomData.id, { name: trimmedName, icon, iconName: icon })
    setEditing(false)
  }

  const deleteRoom = () => {
    if (!selectedRoomData || selectedDevices.length > 0 || rooms.length <= 1) return
    const nextRoom = rooms.find((room) => room.id !== selectedRoomData.id)
    removeRoom(selectedRoomData.id)
    selectRoom(nextRoom?.id ?? null)
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <p className="text-xs font-medium leading-4 uppercase tracking-wider text-text-tertiary">Rooms</p>
        <h1 className="mt-1 text-2xl font-medium leading-8 text-text-primary"><SpecialText>Every room at a glance</SpecialText></h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const roomDevices = room.deviceIds.map((id) => devices[id]).filter(Boolean)
          const activeCount = roomDevices.filter((device) => device.state.power).length

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                selectRoom(room.id)
                setName(room.name)
                setIcon(room.iconName ?? room.icon)
                setEditing(false)
                setDeviceToDelete(null)
              }}
              className="rounded-[var(--radius-room)] border border-border-room bg-bg-room-group p-4 text-left transition-colors hover:border-border-input hover:bg-bg-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-bg-elevated text-text-secondary">
                    <RoomIcon name={room.iconName ?? room.icon} size={20} />
                  </span>
                  <h2 className="mt-2 text-sm font-medium leading-5 text-text-primary">{room.name}</h2>
                </div>
                <span className="text-xs leading-4 text-text-tertiary">{activeCount} on</span>
              </div>
              <p className="mt-4 text-xs leading-4 text-text-secondary">
                {roomDevices.length} {roomDevices.length === 1 ? "device" : "devices"}
              </p>
            </button>
          )
        })}
      </div>

      {selectedRoomData && (
        <section className="mt-4 rounded-[var(--radius-room)] border border-border-room bg-bg-room-group p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated text-text-secondary">
                <RoomIcon name={selectedRoomData.iconName ?? selectedRoomData.icon} size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-text-tertiary">Room details</p>
                <h2 className="truncate text-base font-medium leading-5 text-text-primary"><SpecialText effect="soft">{selectedRoomData.name}</SpecialText></h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { if (editing) { setEditing(false) } else { setName(selectedRoomData.name); setIcon(selectedRoomData.iconName ?? selectedRoomData.icon); setEditing(true) } }} className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent hover:text-text-primary">
                {editing ? <X size={14} /> : <Pencil size={14} />}
                {editing ? "Cancel" : "Edit room"}
              </button>
              <button type="button" disabled={selectedDevices.length > 0 || rooms.length <= 1} onClick={deleteRoom} title={selectedDevices.length > 0 ? "Move all devices before deleting this room" : "Delete room"} className="flex h-8 items-center gap-1.5 rounded-lg border border-danger/30 px-2.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-35">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>

          {editing && (
            <div className="grid gap-4 border-b border-border py-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
              <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium leading-4 text-text-secondary">
                Room name
                <input value={name} onChange={(event) => setName(event.target.value)} aria-label="Room name" className="h-10 w-full rounded-[var(--radius-input)] border border-border-input bg-bg-device-off px-3 text-sm font-normal text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent" />
              </label>
              <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium leading-4 text-text-secondary">
                Icon
                <RoomIconPicker value={icon} onValueChange={setIcon} />
              </label>
              <div className="flex justify-end sm:col-span-2">
                <button type="button" disabled={!name.trim()} onClick={saveRoom} className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[var(--radius-button)] bg-accent px-5 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-24">
                  <Save size={15} />
                  Save changes
                </button>
              </div>
            </div>
          )}

          <div className="pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium leading-5 text-text-primary">Devices in this room</h3>
              <span className="text-xs text-text-tertiary">{selectedDevices.length} {selectedDevices.length === 1 ? "device" : "devices"}</span>
            </div>
            {selectedDevices.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm leading-5 text-text-tertiary">No devices in this room.</p>
            ) : (
              <div className="grid gap-2 lg:grid-cols-2">
                {selectedDevices.map((device) => (
                  <div key={device.id} className="flex min-w-0 items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <DeviceTile device={device} variant="compact" />
                    </div>
                    <button type="button" aria-label={`Delete ${device.name}`} onClick={() => setDeviceToDelete(device.id)} className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-danger/30 text-danger transition-colors hover:bg-danger/10">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {deviceToDelete && selectedDevices.some((device) => device.id === deviceToDelete) && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <p className="text-xs leading-4 text-text-secondary">Delete “{devices[deviceToDelete]?.name}” permanently?</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDeviceToDelete(null)} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-elevated">Cancel</button>
                <button type="button" onClick={() => { removeDevice(deviceToDelete); setDeviceToDelete(null) }} className="rounded-md border border-danger/30 px-2.5 py-1.5 text-xs font-medium text-danger hover:bg-danger/10">Delete device</button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

interface DevicesViewProps {
  devices: Device[]
}

export function DevicesView({ devices }: DevicesViewProps) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <p className="text-xs font-medium leading-4 uppercase tracking-wider text-text-tertiary">Devices</p>
        <h1 className="mt-1 text-2xl font-medium leading-8 text-text-primary"><SpecialText>All connected devices</SpecialText></h1>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {devices.filter((device) => device.type !== "sensor").map((device) => (
          <DeviceTile key={device.id} device={device} variant="compact" />
        ))}
      </div>
    </div>
  )
}

interface ScenesViewProps {
  scenes: Scene[]
}

export function ScenesView({ scenes }: ScenesViewProps) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <p className="text-xs font-medium leading-4 uppercase tracking-wider text-text-tertiary">Scenes</p>
        <h1 className="mt-1 text-2xl font-medium leading-8 text-text-primary"><SpecialText effect="shimmer">Run a scene</SpecialText></h1>
        <p className="mt-2 text-sm leading-5 text-text-secondary">Apply multiple device actions at once.</p>
      </div>
      <QuickScenes scenes={scenes} />
    </div>
  )
}
