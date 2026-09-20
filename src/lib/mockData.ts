import type { Device, DeviceState, DeviceType, Room, Scene, SystemInfo } from "./types"

export const ROOMS: Room[] = [
  {
    id: "living-room",
    name: "Living Room",
    icon: "sofa",
    deviceIds: ["lr-ceiling-light", "lr-ac", "lr-tv", "lr-curtain", "lr-speaker"],
    order: 0,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    icon: "bed",
    deviceIds: ["br-main-light", "br-bedside-light", "br-ac", "br-curtain"],
    order: 1,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "chef-hat",
    deviceIds: ["kit-main-light", "kit-fan", "kit-plug"],
    order: 2,
  },
  {
    id: "workspace",
    name: "Workspace",
    icon: "laptop",
    deviceIds: ["ws-desk-light", "ws-ac", "ws-monitor-plug"],
    order: 3,
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: "bath",
    deviceIds: ["ba-main-light", "ba-fan"],
    order: 4,
  },
  {
    id: "balcony",
    name: "Balcony",
    icon: "plant",
    deviceIds: ["bal-light", "bal-curtain"],
    order: 5,
  },
]

function baseState(power = false, overrides: Partial<DeviceState> = {}): DeviceState {
  return {
    power,
    brightness: power ? 72 : undefined,
    temperature: power ? 24 : undefined,
    fanSpeed: power ? "auto" : undefined,
    mode: power ? "auto" : undefined,
    position: power ? 40 : 0,
    volume: power ? 45 : undefined,
    channel: power ? "03" : undefined,
    locked: power,
    lastUpdated: new Date().toISOString(),
    connection: "connected",
    ...overrides,
  }
}

function makeDevice(
  id: string,
  name: string,
  type: DeviceType,
  roomId: string,
  icon: string,
  power: boolean,
  extra: Partial<Omit<Device, "id" | "name" | "type" | "roomId" | "online" | "state">> & {
    state?: Partial<DeviceState>
  } = {}
): Device {
  return {
    id,
    name,
    type,
    roomId,
    online: true,
    connected: true,
    state: baseState(power, extra.state),
    powerConsumption: extra.powerConsumption ?? 0,
    protocol: extra.protocol ?? "zigbee",
    icon,
    brand: extra.brand,
    model: extra.model,
    firmware: extra.firmware,
    tasmotaChannel: extra.tasmotaChannel,
    tasmotaDevice: extra.tasmotaDevice,
    capabilities: extra.capabilities ?? [],
  }
}

export const DEVICES: Device[] = [
  // Living Room
  makeDevice("lr-ceiling-light", "Ceiling Light", "light", "living-room", "💡", true, {
    protocol: "zigbee",
    powerConsumption: 15.4,
    capabilities: ["brightness", "color-temp"],
  }),
  makeDevice("lr-ac", "Air Conditioner", "ac", "living-room", "❄", true, {
    protocol: "wifi",
    powerConsumption: 850,
    capabilities: ["temperature", "fan-speed", "mode"],
    state: { power: true, temperature: 24, mode: "cool", fanSpeed: "auto" },
  }),
  makeDevice("lr-tv", "Smart TV", "tv", "living-room", "📺", true, {
    protocol: "wifi",
    powerConsumption: 75,
    capabilities: ["volume", "channel", "input"],
    state: { power: true, volume: 30, channel: "03" },
  }),
  makeDevice("lr-curtain", "Curtain", "curtain", "living-room", "🫶", true, {
    protocol: "matter",
    powerConsumption: 5,
    capabilities: ["position"],
    state: { power: true, position: 40 },
  }),
  makeDevice("lr-speaker", "Speaker", "speaker", "living-room", "🎵", false, {
    protocol: "bluetooth",
    powerConsumption: 25,
    capabilities: ["volume"],
  }),

  // Bedroom
  makeDevice("br-main-light", "Main Light", "light", "bedroom", "💡", false, {
    protocol: "zigbee",
    powerConsumption: 12.3,
    capabilities: ["brightness", "color-temp"],
  }),
  makeDevice("br-bedside-light", "Bedside Light", "light", "bedroom", "💡", false, {
    protocol: "zigbee",
    powerConsumption: 8.1,
    capabilities: ["brightness"],
  }),
  makeDevice("br-ac", "AC", "ac", "bedroom", "❄", false, {
    protocol: "wifi",
    powerConsumption: 650,
    capabilities: ["temperature", "fan-speed", "mode"],
  }),
  makeDevice("br-curtain", "Curtain", "curtain", "bedroom", "🫶", true, {
    protocol: "matter",
    powerConsumption: 5,
    capabilities: ["position"],
    state: { power: true, position: 20 },
  }),

  // Kitchen
  makeDevice("kit-main-light", "Main Light", "light", "kitchen", "💡", true, {
    protocol: "zigbee",
    powerConsumption: 10.2,
    capabilities: ["brightness"],
  }),
  makeDevice("kit-fan", "Ventilation Fan", "fan", "kitchen", "🌀", true, {
    protocol: "zigbee",
    powerConsumption: 28,
    capabilities: ["fan-speed"],
    state: { power: true, fanSpeed: "medium" },
  }),
  makeDevice("kit-plug", "Smart Plug", "plug", "kitchen", "🔌", true, {
    protocol: "matter",
    powerConsumption: 1200,
    capabilities: ["power-meter"],
  }),

  // Workspace
  makeDevice("ws-desk-light", "Desk Light", "light", "workspace", "💡", true, {
    protocol: "wifi",
    powerConsumption: 8.0,
    capabilities: ["brightness", "color"],
  }),
  makeDevice("ws-ac", "AC", "ac", "workspace", "❄", false, {
    protocol: "wifi",
    powerConsumption: 950,
    capabilities: ["temperature", "fan-speed", "mode"],
  }),
  makeDevice("ws-monitor-plug", "Monitor Plug", "plug", "workspace", "🔌", true, {
    protocol: "zigbee",
    powerConsumption: 45,
    capabilities: ["power-meter"],
  }),

  // Bathroom
  makeDevice("ba-main-light", "Main Light", "light", "bathroom", "💡", false, {
    protocol: "bluetooth",
    powerConsumption: 6.0,
    capabilities: ["brightness"],
  }),
  makeDevice("ba-fan", "Exhaust Fan", "fan", "bathroom", "🌀", false, {
    protocol: "zigbee",
    powerConsumption: 18,
    capabilities: ["fan-speed"],
  }),

  // Balcony
  makeDevice("bal-light", "Balcony Light", "light", "balcony", "💡", false, {
    protocol: "zigbee",
    powerConsumption: 7.5,
    capabilities: ["brightness"],
  }),
  makeDevice("bal-curtain", "Curtain", "curtain", "balcony", "🫶", false, {
    protocol: "matter",
    powerConsumption: 5,
    capabilities: ["position"],
  }),

  // Sensors
  makeDevice("lr-temp-sensor", "Temperature Sensor", "sensor", "living-room", "🌡", true, {
    subtype: "temperature",
    protocol: "zigbee",
    powerConsumption: 0.5,
    capabilities: [],
    state: { power: true, temperature: 22, connection: "connected" },
  }),
  makeDevice("ba-humidity-sensor", "Humidity Sensor", "sensor", "bathroom", "💧", true, {
    subtype: "humidity",
    protocol: "zigbee",
    powerConsumption: 0.5,
    capabilities: [],
    state: { power: true, connection: "connected", humidity: 68 },
  }),
]

export const SCENES: Scene[] = [
  {
    id: "scene-morning",
    name: "Morning",
    icon: "☀",
    deviceActions: [
      { deviceId: "lr-ceiling-light", state: { power: true, brightness: 100 } },
      { deviceId: "br-main-light", state: { power: true, brightness: 60 } },
      { deviceId: "lr-ac", state: { power: true, temperature: 22, mode: "cool" } },
      { deviceId: "kit-main-light", state: { power: true, brightness: 50 } },
    ],
  },
  {
    id: "scene-away",
    name: "Away",
    icon: "🚪",
    deviceActions: [
      { deviceId: "lr-ceiling-light", state: { power: false } },
      { deviceId: "br-main-light", state: { power: false } },
      { deviceId: "lr-ac", state: { power: false } },
      { deviceId: "ws-monitor-plug", state: { power: false } },
    ],
  },
  {
    id: "scene-movie",
    name: "Movie",
    icon: "▐",
    deviceActions: [
      { deviceId: "lr-ceiling-light", state: { power: true, brightness: 15 } },
      { deviceId: "lr-tv", state: { power: true } },
      { deviceId: "lr-ac", state: { power: true, temperature: 23, mode: "cool", fanSpeed: "low" } },
      { deviceId: "lr-curtain", state: { power: true, position: 10 } },
    ],
  },
  {
    id: "scene-sleep",
    name: "Sleep",
    icon: "🌙",
    deviceActions: [
      { deviceId: "br-main-light", state: { power: true, brightness: 10 } },
      { deviceId: "br-bedside-light", state: { power: true, brightness: 5 } },
      { deviceId: "bal-light", state: { power: false } },
    ],
  },
  {
    id: "scene-home",
    name: "Home",
    icon: "🏠",
    deviceActions: [
      { deviceId: "lr-ceiling-light", state: { power: true, brightness: 80 } },
      { deviceId: "br-main-light", state: { power: true, brightness: 100 } },
      { deviceId: "bal-light", state: { power: true, brightness: 100 } },
    ],
  },
]

export const SYSTEM_INFO: SystemInfo = {
  status: "online",
  uptime: "3d 14h 22m",
  mqttConnected: false,
  localIp: "192.168.1.104",
  version: "1.2.4",
  lastBoot: new Date().toISOString(),
}

export const MOCK_ROOMS: Room[] = [
  {
    id: "aclab",
    name: "ACLAB",
    icon: "house",
    deviceIds: ["aclab-switch-1", "aclab-switch-2", "aclab-switch-3", "aclab-switch-4", "aclab-switch-5"],
    order: 0,
  },
]

export const MOCK_DEVICES: Device[] = [
  makeDevice("aclab-switch-1", "ACLAB Light 1", "light", "aclab", "💡", true, {
    protocol: "local",
    tasmotaChannel: 1,
    capabilities: ["power"],
  }),
  makeDevice("aclab-switch-2", "ACLAB Light 2", "light", "aclab", "💡", true, {
    protocol: "local",
    tasmotaChannel: 2,
    capabilities: ["power"],
  }),
  makeDevice("aclab-switch-3", "ACLAB Light 3", "light", "aclab", "💡", true, {
    protocol: "local",
    tasmotaChannel: 3,
    capabilities: ["power"],
  }),
  makeDevice("aclab-switch-4", "ACLAB 4C Light 1", "light", "aclab", "💡", false, {
    protocol: "local",
    tasmotaChannel: 1,
    tasmotaDevice: "secondary",
    capabilities: ["power"],
  }),
  makeDevice("aclab-switch-5", "ACLAB 4C Light 2", "light", "aclab", "💡", false, {
    protocol: "local",
    tasmotaChannel: 2,
    tasmotaDevice: "secondary",
    capabilities: ["power"],
  }),
]

export const MOCK_SCENES: Scene[] = []
export const MOCK_SYSTEM_INFO = SYSTEM_INFO
