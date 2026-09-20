import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Device, DeviceState, Room, Scene, SystemInfo, ZustandStore } from "@/lib/types"
import { MOCK_DEVICES, MOCK_ROOMS, MOCK_SCENES, MOCK_SYSTEM_INFO } from "@/lib/mockData"

function deviceRecord(devices: Device[]): Record<string, Device> {
  return devices.reduce((acc, d) => {
    acc[d.id] = d
    return acc
  }, {} as Record<string, Device>)
}

function roomRecord(rooms: Room[]): Record<string, Room> {
  return rooms.reduce((acc, r) => {
    acc[r.id] = r
    return acc
  }, {} as Record<string, Room>)
}

function sceneRecord(scenes: Scene[]): Record<string, Scene> {
  return scenes.reduce((acc, s) => {
    acc[s.id] = s
    return acc
  }, {} as Record<string, Scene>)
}

export const useStore = create<ZustandStore>()(
  devtools((set, get) => ({
    devices: deviceRecord(MOCK_DEVICES),
    rooms: roomRecord(MOCK_ROOMS),
    roomOrder: MOCK_ROOMS.sort((a, b) => a.order - b.order).map((r) => r.id),
    selectedRoom: "living-room",
    selectedDevice: null,
    scenes: sceneRecord(MOCK_SCENES),
    sceneOrder: ["scene-morning", "scene-away", "scene-movie", "scene-sleep", "scene-home"],
    systemInfo: MOCK_SYSTEM_INFO,
    sidebarCollapsed: false,
    selectedMode: "home",

    toggleDevice: (deviceId: string) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        const newState = { ...device.state, power: !device.state.power }
        if (device.tasmotaChannel && typeof window !== "undefined") {
          void fetch("/api/tasmota", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device: device.tasmotaDevice ?? "primary", channel: device.tasmotaChannel, action: "toggle" }),
          }).catch(() => undefined)
        }
        return {
          devices: {
            ...state.devices,
            [deviceId]: { ...device, state: newState },
          },
        }
      }),

    selectDevice: (deviceId: string | null) => set({ selectedDevice: deviceId }),

    selectRoom: (roomId: string | null) => set({ selectedRoom: roomId, selectedDevice: null }),

    setBrightness: (deviceId: string, brightness: number) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        return {
          devices: {
            ...state.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, brightness, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),

    setTemperature: (deviceId: string, temperature: number) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        return {
          devices: {
            ...state.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, temperature, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),

    setFanSpeed: (deviceId: string, speed: DeviceState["fanSpeed"]) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        return {
          devices: {
            ...state.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, fanSpeed: speed, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),

    setMode: (deviceId: string, mode: DeviceState["mode"]) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        return {
          devices: {
            ...state.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, mode, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),

    setCurtainPosition: (deviceId: string, position: number) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        return {
          devices: {
            ...state.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, position, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),

    setVolume: (deviceId: string, volume: number) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        return {
          devices: {
            ...state.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, volume, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),

    setLock: (deviceId: string, locked: boolean) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device) return state
        return {
          devices: {
            ...state.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, locked, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),

    runScene: (sceneId: string) => {
      const scene = get().scenes[sceneId]
      if (!scene) return
      set((state) => {
        const newDevices = { ...state.devices }
        scene.deviceActions.forEach((action) => {
          const device = newDevices[action.deviceId]
          if (device) {
            newDevices[action.deviceId] = {
              ...device,
              state: { ...device.state, ...action.state, lastUpdated: new Date().toISOString() },
            }
          }
        })
        return { devices: newDevices }
      })
    },

    setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

    setSelectedMode: (mode: ZustandStore["selectedMode"]) => set({ selectedMode: mode }),

    setSystemInfo: (info: Partial<SystemInfo>) =>
      set((state) => ({
        systemInfo: { ...state.systemInfo, ...info },
      })),

    updateRoom: (roomId, updates) =>
      set((state) => {
        const room = state.rooms[roomId]
        if (!room) return state

        const name = updates.name?.trim()
        if (updates.name !== undefined && !name) return state

        return {
          rooms: {
            ...state.rooms,
            [roomId]: {
              ...room,
              ...updates,
              ...(name ? { name } : {}),
              ...(updates.iconName ? { icon: updates.iconName } : {}),
            },
          },
        }
      }),

    addRoom: (room) =>
      set((state) => {
        const id = room.id ?? `room-${Date.now()}`
        if (state.rooms[id]) return state

        const order = room.order ?? Math.max(-1, ...Object.values(state.rooms).map((item) => item.order)) + 1
        const newRoom: Room = {
          ...room,
          iconName: room.iconName ?? room.icon,
          id,
          order,
          deviceIds: [],
        }

        return {
          rooms: { ...state.rooms, [id]: newRoom },
          roomOrder: [...state.roomOrder, id],
        }
      }),

    removeRoom: (roomId: string) =>
      set((state) => {
        const room = state.rooms[roomId]
        if (!room || room.deviceIds.length > 0) return state

        const rooms = { ...state.rooms }
        delete rooms[roomId]

        return {
          rooms,
          roomOrder: state.roomOrder.filter((id) => id !== roomId),
          selectedRoom: state.selectedRoom === roomId ? state.roomOrder.find((id) => id !== roomId) ?? null : state.selectedRoom,
        }
      }),

    moveDeviceToRoom: (deviceId: string, roomId: string) =>
      set((state) => {
        const device = state.devices[deviceId]
        if (!device || !state.rooms[roomId]) return state

        const rooms = Object.fromEntries(
          Object.entries(state.rooms).map(([id, room]) => [
            id,
            {
              ...room,
              deviceIds: room.deviceIds.filter((id) => id !== deviceId),
            },
          ])
        ) as Record<string, Room>

        rooms[roomId] = {
          ...rooms[roomId],
          deviceIds: [...rooms[roomId].deviceIds, deviceId],
        }

        return {
          devices: {
            ...state.devices,
            [deviceId]: { ...device, roomId },
          },
          rooms,
        }
      }),

    addDevice: (device: Omit<Device, "id"> & { id?: string }) =>
      set((state) => {
        const id = device.id ?? `dev-${Date.now()}`
        const roomId = device.roomId
        const newDevice: Device = { ...device, id: id as string }
        const newRoom = state.rooms[roomId]
        if (newRoom) {
          newRoom.deviceIds = [...newRoom.deviceIds, id as string]
        }
        return {
          devices: { ...state.devices, [id as string]: newDevice },
          rooms: newRoom ? { ...state.rooms, [roomId]: newRoom } : state.rooms,
        }
      }),

    removeDevice: (deviceId: string) =>
      set((state) => {
        const newDevices = { ...state.devices }
        delete newDevices[deviceId]
        const newRooms = { ...state.rooms }
        Object.values(newRooms).forEach((room) => {
          room.deviceIds = room.deviceIds.filter((id) => id !== deviceId)
        })
        return { devices: newDevices, rooms: newRooms }
      }),

    setDeviceState: (deviceId: string, state: Partial<DeviceState>) =>
      set((storeState) => {
        const device = storeState.devices[deviceId]
        if (!device) return storeState
        return {
          devices: {
            ...storeState.devices,
            [deviceId]: {
              ...device,
              state: { ...device.state, ...state, lastUpdated: new Date().toISOString() },
            },
          },
        }
      }),
  }))
)
