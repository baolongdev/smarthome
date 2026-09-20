import { NextResponse } from "next/server"

export const runtime = "nodejs"

type Channel = 1 | 2 | 3 | 4
type TasmotaDevice = "primary" | "secondary"
type ChannelState = Record<`power${Channel}`, boolean>

function getDeviceUrl(device: TasmotaDevice = "primary") {
  const value = (device === "secondary" ? process.env.TASMOTA_DEVICE_URL_2 : process.env.TASMOTA_DEVICE_URL)?.trim()
  if (!value) throw new Error("Missing TASMOTA_DEVICE_URL environment variable")
  return value.replace(/\/$/, "")
}

async function readChannelStates(device: TasmotaDevice): Promise<ChannelState> {
  const response = await fetch(`${getDeviceUrl(device)}/?m=1`, { cache: "no-store" })
  if (!response.ok) throw new Error(`Tasmota status request failed: ${response.status}`)
  const html = await response.text()
  const values = [...html.matchAll(/<td[^>]*>\s*(ON|OFF)\s*<\/td>/gi)].map((match) => match[1].toUpperCase() === "ON")
  return {
    power1: values[0] ?? false,
    power2: values[1] ?? false,
    power3: values[2] ?? false,
    power4: values[3] ?? false,
  }
}

export async function GET() {
  try {
    const devices = await Promise.all(
      (["primary", "secondary"] as const).map(async (device) => {
        try {
          return [device, await readChannelStates(device)] as const
        } catch {
          return [device, null] as const
        }
      }),
    )
    return NextResponse.json({ states: Object.fromEntries(devices) })
  } catch (error) {
    console.error("Tasmota status failed", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Unable to reach Tasmota device" }, { status: 503 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { device?: unknown; channel?: unknown; action?: unknown }
    const channel = body.channel
    const device = body.device === "secondary" ? "secondary" : "primary"
    const action = body.action
    if ((channel !== 1 && channel !== 2 && channel !== 3 && channel !== 4) || (action !== "on" && action !== "off" && action !== "toggle")) {
      return NextResponse.json({ error: "Invalid channel or action" }, { status: 400 })
    }

    // Tasmota's own web UI sends `.?m=1&o=<channel>` for its toggle buttons.
    const response = await fetch(`${getDeviceUrl(device)}/?m=1&o=${channel}`, { cache: "no-store" })
    if (!response.ok) throw new Error(`Tasmota command failed: ${response.status}`)

    return NextResponse.json({ device, states: await readChannelStates(device) })
  } catch (error) {
    console.error("Tasmota command failed", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Unable to control Tasmota device" }, { status: 503 })
  }
}
