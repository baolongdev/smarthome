import { NextResponse } from "next/server"

import type { Device } from "@/lib/types"
import { getMongoDb } from "@/lib/mongodb"

export const runtime = "nodejs"

function isDevice(value: unknown): value is Device {
  if (!value || typeof value !== "object") return false
  const device = value as Partial<Device>
  return typeof device.id === "string"
    && typeof device.name === "string"
    && typeof device.roomId === "string"
    && typeof device.type === "string"
    && typeof device.state === "object"
}

export async function GET() {
  try {
    const db = await getMongoDb()
    const devices = await db.collection<Device>("devices").find({}).sort({ id: 1 }).toArray()

    return NextResponse.json({
      devices: devices.map((device) => Object.fromEntries(
        Object.entries(device).filter(([key]) => key !== "_id"),
      )),
    })
  } catch (error) {
    console.error("MongoDB device read failed", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Unable to load devices" }, { status: 503 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as { devices?: unknown }
    if (!Array.isArray(body.devices) || !body.devices.every(isDevice)) {
      return NextResponse.json({ error: "Invalid devices payload" }, { status: 400 })
    }

    const db = await getMongoDb()
    const collection = db.collection<Device>("devices")
    const devices = body.devices

    if (devices.length > 0) {
      await collection.bulkWrite(
        devices.map((device) => ({
          replaceOne: {
            filter: { id: device.id },
            replacement: device,
            upsert: true,
          },
        })),
      )
    }

    await collection.deleteMany({ id: { $nin: devices.map((device) => device.id) } })

    return NextResponse.json({ ok: true, count: devices.length })
  } catch (error) {
    console.error("MongoDB device sync failed", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Unable to sync devices" }, { status: 503 })
  }
}
