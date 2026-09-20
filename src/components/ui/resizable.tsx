"use client"

import type { ComponentProps } from "react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({ className, ...props }: ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn(
        "flex h-full w-full data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

function ResizablePanel({ className, ...props }: ComponentProps<typeof Panel>) {
  return <Panel className={cn("min-w-0", className)} {...props} />
}

function ResizableHandle({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        "relative flex w-px items-center justify-center bg-border outline-none transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-2 focus-visible:ring-accent data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:inset-x-0 data-[orientation=vertical]:after:top-1/2 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0",
        className,
      )}
      {...props}
    />
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
