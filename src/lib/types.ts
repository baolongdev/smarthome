export type DeviceType =
  | "light"
  | "ac"
  | "fan"
  | "curtain"
  | "plug"
  | "tv"
  | "speaker"
  | "lock"
  | "camera"
  | "sensor"

export type DeviceProtocol =
  | "wifi"
  | "mqtt"
  | "zigbee"
  | "matter"
  | "thread"
  | "bluetooth"
  | "local"

export type DeviceSubtype =
  | "temperature"
  | "humidity"
  | "motion"
  | "air-quality"
  | "door"
  | "window"

export interface PowerState {
  power: boolean
  brightness?: number
  temperature?: number
  mode?: "cool" | "heat" | "fan" | "dry" | "auto"
  fanSpeed?: "auto" | "low" | "medium" | "high"
  position?: number
  volume?: number
  channel?: string
  locked?: boolean
  brightnessMin?: number
  brightnessMax?: number
}

export interface DeviceState {
  power: boolean
  brightness?: number
  temperature?: number
  humidity?: number
  mode?: "cool" | "heat" | "fan" | "dry" | "auto"
  fanSpeed?: "auto" | "low" | "medium" | "high"
  position?: number
  volume?: number
  channel?: string
  locked?: boolean
  lastUpdated: string
  connection: "connected" | "disconnected" | "reconnecting"
}

export interface Device {
  id: string
  name: string
  type: DeviceType
  subtype?: DeviceSubtype
  roomId: string
  online: boolean
  connected: boolean
  state: DeviceState
  stateHistory?: PowerState[]
  powerConsumption: number
  protocol: DeviceProtocol
  icon: string
  brand?: string
  model?: string
  firmware?: string
  tasmotaChannel?: 1 | 2 | 3 | 4
  tasmotaDevice?: "primary" | "secondary"
  capabilities: string[]
}

export interface Room {
  id: string
  name: string
  icon: string
  /** Newer room records may use iconName; icon remains for legacy persisted data. */
  iconName?: string
  deviceIds: string[]
  order: number
}

export interface Scene {
  id: string
  name: string
  icon: string
  roomId?: string
  deviceActions: Array<{
    deviceId: string
    state: Partial<PowerState>
  }>
}

export type SystemStatus = "online" | "offline" | "degraded" | "maintenance"

export interface SystemInfo {
  status: SystemStatus
  uptime: string
  mqttConnected: boolean
  localIp: string
  version: string
  lastBoot: string
}

export interface ZustandStore {
  devices: Record<string, Device>
  rooms: Record<string, Room>
  roomOrder: string[]
  selectedRoom: string | null
  selectedDevice: string | null
  scenes: Record<string, Scene>
  sceneOrder: string[]
  systemInfo: SystemInfo
  sidebarCollapsed: boolean
  selectedMode: "home" | "rooms" | "devices" | "scenes" | "settings"

  toggleDevice: (deviceId: string) => void
  selectDevice: (deviceId: string | null) => void
  selectRoom: (roomId: string | null) => void
  setBrightness: (deviceId: string, brightness: number) => void
  setTemperature: (deviceId: string, temperature: number) => void
  setFanSpeed: (deviceId: string, speed: DeviceState["fanSpeed"]) => void
  setMode: (deviceId: string, mode: DeviceState["mode"]) => void
  setCurtainPosition: (deviceId: string, position: number) => void
  setVolume: (deviceId: string, volume: number) => void
  setLock: (deviceId: string, locked: boolean) => void
  runScene: (sceneId: string) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSelectedMode: (mode: ZustandStore["selectedMode"]) => void
  setSystemInfo: (info: Partial<SystemInfo>) => void
  updateRoom: (roomId: string, updates: Partial<Pick<Room, "name" | "icon" | "iconName">>) => void
  addRoom: (room: Omit<Room, "id" | "order" | "deviceIds"> & { id?: string; order?: number }) => void
  removeRoom: (roomId: string) => void
  moveDeviceToRoom: (deviceId: string, roomId: string) => void
  addDevice: (device: Omit<Device, "id"> & { id?: string }) => void
  removeDevice: (deviceId: string) => void
  setDeviceState: (deviceId: string, state: Partial<DeviceState>) => void
}
