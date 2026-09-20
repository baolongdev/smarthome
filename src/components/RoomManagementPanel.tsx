"use client"

import { FormEvent, useMemo, useState } from "react"
import { Trash2 } from "lucide-react"

import { useStore } from "@/store/useStore"
import { RoomIcon } from "@/components/RoomIcon"
import { RoomIconPicker } from "@/components/RoomIconPicker"
import { SpecialText } from "@/components/animations/SpecialText"

export function RoomManagementPanel() {
  const { rooms, roomOrder, devices, addRoom, removeRoom, moveDeviceToRoom } = useStore()
  const [roomName, setRoomName] = useState("")
  const [roomIcon, setRoomIcon] = useState("house")
  const [selectedRoomId, setSelectedRoomId] = useState(roomOrder[0] ?? "")
  const [selectedDeviceId, setSelectedDeviceId] = useState("")
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

  const orderedRooms = useMemo(
    () => roomOrder.map((id) => rooms[id]).filter(Boolean).sort((a, b) => a.order - b.order),
    [roomOrder, rooms],
  )

  const availableDevices = Object.values(devices).filter(
    (device) => device.roomId !== selectedRoomId,
  )

  const handleCreateRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = roomName.trim()
    if (!name) return

    const id = `room-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`
    addRoom({ id, name, icon: roomIcon, iconName: roomIcon })
    setSelectedRoomId(id)
    setRoomName("")
  }

  const handleMoveDevice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedDeviceId || !selectedRoomId) return

    moveDeviceToRoom(selectedDeviceId, selectedRoomId)
    setSelectedDeviceId("")
  }

  const handleRemoveRoom = (roomId: string) => {
    setRoomToDelete(roomId)
  }

  const handleConfirmRemoveRoom = (roomId: string) => {
    const nextRoom = orderedRooms.find((room) => room.id !== roomId)
    removeRoom(roomId)
    setRoomToDelete(null)

    if (selectedRoomId === roomId) {
      setSelectedRoomId(nextRoom?.id ?? "")
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase leading-4 tracking-wider text-text-tertiary">Settings</p>
        <h1 className="mt-1 text-2xl font-medium leading-8 text-text-primary"><SpecialText>Manage rooms</SpecialText></h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-5 text-text-secondary">Create rooms and assign devices to keep your dashboard organized.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[var(--radius-room)] border border-border-room bg-bg-room-group p-5">
          <h2 className="text-base font-medium leading-5 text-text-primary">Create a room</h2>
          <form onSubmit={handleCreateRoom} className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-xs leading-4 text-text-secondary">
              Room name
              <input
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                placeholder="e.g. Studio"
                className="h-10 rounded-[var(--radius-input)] border border-border-input bg-bg-device-off px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs leading-4 text-text-secondary">
              Icon
              <RoomIconPicker value={roomIcon} onValueChange={setRoomIcon} />
            </label>
            <button type="submit" className="h-10 rounded-[var(--radius-button)] bg-accent px-4 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90">
              Create room
            </button>
          </form>
        </section>

        <section className="rounded-[var(--radius-room)] border border-border-room bg-bg-room-group p-5">
          <h2 className="text-base font-medium leading-5 text-text-primary">Assign a device</h2>
          <form onSubmit={handleMoveDevice} className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-xs leading-4 text-text-secondary">
              Destination room
              <select
                value={selectedRoomId}
                onChange={(event) => setSelectedRoomId(event.target.value)}
                className="h-10 rounded-[var(--radius-input)] border border-border-input bg-bg-device-off px-3 text-sm text-text-primary outline-none focus:border-accent"
              >
                {orderedRooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs leading-4 text-text-secondary">
              Device
              <select
                value={selectedDeviceId}
                onChange={(event) => setSelectedDeviceId(event.target.value)}
                className="h-10 rounded-[var(--radius-input)] border border-border-input bg-bg-device-off px-3 text-sm text-text-primary outline-none focus:border-accent"
              >
                <option value="">Select a device</option>
                {availableDevices.map((device) => (
                  <option key={device.id} value={device.id}>{device.name}</option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={!selectedDeviceId || !selectedRoomId} className="h-10 rounded-[var(--radius-button)] border border-border bg-bg-elevated px-4 text-sm font-medium text-text-primary transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40">
              Add device to room
            </button>
          </form>
        </section>
      </div>

      <section className="mt-4 rounded-[var(--radius-room)] border border-border-room bg-bg-room-group p-5">
        <h2 className="text-base font-medium leading-5 text-text-primary">Current rooms</h2>
        <div className="mt-4 grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orderedRooms.map((room) => (
            <div
              key={room.id}
              className={`flex h-full min-h-[140px] flex-col rounded-xl border p-3 text-left transition-colors ${selectedRoomId === room.id ? "border-accent bg-bg-elevated" : "border-border bg-bg-device-off hover:border-border-input"}`}
            >
              <button
                type="button"
                onClick={() => setSelectedRoomId(room.id)}
                className="flex min-h-[58px] w-full flex-1 items-center gap-3 text-left"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated text-text-secondary">
                  <RoomIcon name={room.iconName ?? room.icon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium leading-5 text-text-primary">{room.name}</span>
                  <span className="mt-1 block text-xs leading-4 text-text-tertiary">{room.deviceIds.length} {room.deviceIds.length === 1 ? "device" : "devices"}</span>
                </div>
              </button>
              <button
                type="button"
                disabled={room.deviceIds.length > 0 || orderedRooms.length <= 1}
                onClick={() => handleRemoveRoom(room.id)}
                title={room.deviceIds.length > 0 ? "Move all devices before deleting this room" : "Delete room"}
                aria-label={`Delete ${room.name}`}
                className="mt-3 flex size-8 shrink-0 items-center justify-center self-end rounded-lg border border-danger/30 text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Trash2 size={14} />
              </button>
              {roomToDelete === room.id && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-xs leading-4 text-text-secondary">Delete “{room.name}”?</p>
                  <div className="mt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setRoomToDelete(null)} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary">
                      Cancel
                    </button>
                    <button type="button" onClick={() => handleConfirmRemoveRoom(room.id)} className="rounded-md border border-danger/30 px-2.5 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
