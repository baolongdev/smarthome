"use client"

import { useEffect, useRef } from "react"

import type { Device, Room } from "@/lib/types"
import { useStore } from "@/store/useStore"

function toDeviceRecord(devices: Device[]) {
  return devices.reduce<Record<string, Device>>((record, device) => {
    record[device.id] = device
    return record
  }, {})
}

function rebuildRoomDeviceIds(rooms: Record<string, Room>, devices: Device[]) {
  const deviceIdsByRoom = new Map<string, string[]>()
  devices.forEach((device) => {
    const ids = deviceIdsByRoom.get(device.roomId) ?? []
    ids.push(device.id)
    deviceIdsByRoom.set(device.roomId, ids)
  })

  return Object.fromEntries(
    Object.entries(rooms).map(([id, room]) => [
      id,
      { ...room, deviceIds: deviceIdsByRoom.get(id) ?? [] },
    ]),
  ) as Record<string, Room>
}

async function syncDevices(devices: Device[]) {
  await fetch("/api/devices", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ devices }),
  })
}

async function refreshTasmotaDevices() {
  const response = await fetch("/api/tasmota", { cache: "no-store" })
  if (!response.ok) return
  const body = await response.json() as { states?: Record<string, Record<string, boolean> | null> }
  if (!body.states) return
  const states = body.states

  const state = useStore.getState()
  Object.values(state.devices).forEach((device) => {
    const channel = device.tasmotaChannel
    if (!channel) return
    const power = states[device.tasmotaDevice ?? "primary"]?.[`power${channel}`]
    if (typeof power === "boolean" && power !== device.state.power) {
      state.setDeviceState(device.id, { power })
    }
  })
}

export function MongoSync() {
  const skipNextSync = useRef(false)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    const hydrate = async () => {
      try {
        const response = await fetch("/api/devices", { cache: "no-store" })
        if (!response.ok) return

        const body = await response.json() as { devices?: unknown }
        if (!Array.isArray(body.devices) || !body.devices.every((device): device is Device => Boolean(device && typeof device === "object" && "id" in device))) return
        if (cancelled) return

        const serverDevices = body.devices
        if (serverDevices.length > 0) {
          const state = useStore.getState()
          skipNextSync.current = true
          useStore.setState({
            devices: toDeviceRecord(serverDevices),
            rooms: rebuildRoomDeviceIds(state.rooms, serverDevices),
          })
        } else {
          await syncDevices(Object.values(useStore.getState().devices))
        }
      } catch {
        // Mongo is optional at runtime; the local Zustand state remains usable.
      }
    }

    void hydrate()
    const hardwareTimer = setInterval(() => {
      void refreshTasmotaDevices().catch(() => undefined)
    }, 5000)
    void refreshTasmotaDevices().catch(() => undefined)

    const unsubscribe = useStore.subscribe((state, previousState) => {
      if (state.devices === previousState.devices) return
      if (skipNextSync.current) {
        skipNextSync.current = false
        return
      }

      if (syncTimer.current) clearTimeout(syncTimer.current)
      syncTimer.current = setTimeout(() => {
        void syncDevices(Object.values(useStore.getState().devices)).catch(() => undefined)
      }, 300)
    })

    return () => {
      cancelled = true
      unsubscribe()
      clearInterval(hardwareTimer)
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [])

  return null
}
