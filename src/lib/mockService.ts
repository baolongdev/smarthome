import type { Device, DeviceState, DeviceProtocol } from "./types"

export interface DeviceService {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  subscribe: (topic: string, callback: (message: unknown) => void) => Promise<void>
  publish: (topic: string, message: unknown) => Promise<void>
  getState: (deviceId: string) => Promise<DeviceState>
  setState: (deviceId: string, state: Partial<DeviceState>) => Promise<void>
  scanDevices: () => Promise<Device[]>
  isReachable: (deviceId: string) => boolean
}

class MockDeviceService implements DeviceService {
  private connected = false
  private devices: Map<string, DeviceState> = new Map()
  private subscribers: Map<string, Array<(message: unknown) => void>> = new Map()
  private reconnectTimer: ReturnType<typeof setInterval> | null = null

  async connect(): Promise<void> {
    this.connected = true
    this.scheduleReconnect()
  }

  async disconnect(): Promise<void> {
    this.connected = false
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return
    this.reconnectTimer = setInterval(() => {
      if (!this.connected) {
        this.connected = true
      }
    }, 30000)
  }

  async subscribe(topic: string, callback: (message: unknown) => void): Promise<void> {
    const subs = this.subscribers.get(topic) ?? []
    subs.push(callback)
    this.subscribers.set(topic, subs)
  }

  async publish(topic: string, message: unknown): Promise<void> {
    const subs = this.subscribers.get(topic) ?? []
    subs.forEach((cb) => cb(message))
  }

  async getState(deviceId: string): Promise<DeviceState> {
    return this.devices.get(deviceId) ?? { power: false, lastUpdated: new Date().toISOString(), connection: "connected" }
  }

  async setState(deviceId: string, state: Partial<DeviceState>): Promise<void> {
    const current = this.devices.get(deviceId)
    const updated: DeviceState = {
      power: current?.power ?? false,
      lastUpdated: new Date().toISOString(),
      connection: "connected",
      ...current,
      ...state,
    }
    this.devices.set(deviceId, updated)
    await this.publish(`devices/${deviceId}/state`, updated)
  }

  async scanDevices(): Promise<Device[]> {
    return []
  }

  isReachable(): boolean {
    return this.connected
  }

  getConnected(): boolean {
    return this.connected
  }
}

let serviceInstance: MockDeviceService | null = null

export function getDeviceService(): MockDeviceService {
  if (!serviceInstance) {
    serviceInstance = new MockDeviceService()
  }
  return serviceInstance
}

export default MockDeviceService
export type { DeviceProtocol }
