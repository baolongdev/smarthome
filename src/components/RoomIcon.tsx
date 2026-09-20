"use client"

import type { ComponentProps } from "react"

import { getRoomIconOption } from "@/lib/roomIcons"

interface RoomIconProps extends Omit<ComponentProps<"svg">, "name"> {
  name?: string
  size?: number
}

export function RoomIcon({ name, size = 20, strokeWidth = 1.9, ...props }: RoomIconProps) {
  const Icon = getRoomIconOption(name).icon

  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" {...props} />
}
