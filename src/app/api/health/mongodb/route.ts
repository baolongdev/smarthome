import { NextResponse } from "next/server"

import { getMongoDb } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function GET() {
  try {
    const db = await getMongoDb()
    await db.command({ ping: 1 })

    return NextResponse.json({
      ok: true,
      service: "mongodb",
      database: db.databaseName,
    })
  } catch (error) {
    console.error("MongoDB health check failed", error instanceof Error ? error.message : error)

    return NextResponse.json(
      { ok: false, service: "mongodb" },
      { status: 503 },
    )
  }
}
