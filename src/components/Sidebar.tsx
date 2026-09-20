"use client"

import type { ComponentType } from "react"
import { ChevronLeft, ChevronRight, CircleUserRound, Monitor } from "lucide-react"
import { HomeIcon, LayoutGridIcon, PlayIcon, SettingsIcon } from "@/components/icons"
import { ClockWidget } from "./ClockWidget"
import { SystemStatus } from "./SystemStatus"
import { BlurText } from "./animations/BlurText"
import { useStore } from "@/store/useStore"

type NavIcon = ComponentType<{ size?: number; className?: string }>

const navItems: { id: "home" | "rooms" | "devices" | "scenes"; label: string; icon: NavIcon }[] = [
  { id: "home", label: "Home", icon: HomeIcon as NavIcon },
  { id: "rooms", label: "Rooms", icon: LayoutGridIcon as NavIcon },
  { id: "devices", label: "Devices", icon: Monitor as NavIcon },
  { id: "scenes", label: "Scenes", icon: PlayIcon as NavIcon },
]

export function Sidebar() {
  const { selectedMode, setSelectedMode, sidebarCollapsed, setSidebarCollapsed } = useStore()

  const displayName = "blong"
  const homeName = "Chủ Tịch Long"

  return (
    <aside
      className={`
        relative z-30 hidden lg:flex flex-col
        ${sidebarCollapsed ? "w-[64px]" : "w-[200px] xl:w-[220px]"}
        bg-bg-secondary border-r border-border
        transition-all duration-300 ease-out
      `}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4">
          {!sidebarCollapsed && (
            <div className="space-y-1">
              <p className="text-xs font-medium leading-4 text-text-muted uppercase tracking-wider">
                Welcome Home,
              </p>
              <h1 className="text-2xl font-semibold leading-8 text-text-primary">
                <BlurText text={displayName} delay={200} />
              </h1>
              <p className="text-sm leading-5 text-text-tertiary">
                <BlurText text={homeName} delay={300} />
              </p>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center pt-4">
              <div className="flex size-9 items-center justify-center rounded-full border border-accent/60 bg-bg-elevated text-accent" aria-label="User profile">
                <CircleUserRound size={20} strokeWidth={1.8} />
              </div>
            </div>
          )}
        </div>

        <nav className="mt-2 space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = selectedMode === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelectedMode(item.id)}
                className={`
                  flex w-full items-center gap-3 rounded-xl py-2.5
                  transition-all duration-150 ease-out
                  ${sidebarCollapsed ? "justify-center px-0" : "px-3"}
                  ${
                    isActive
                      ? "bg-elevated text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                  }
                `}
              >
                <span
                  className={`
                    flex size-5 shrink-0 items-center justify-center
                    ${isActive ? "text-accent" : ""}
                  `}
                >
                  <Icon size={18} className={isActive ? "text-accent" : ""} />
                </span>
                {!sidebarCollapsed && (
                  <>
                     <span className="text-sm font-medium leading-5">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="mt-4 px-2">
            <button
              onClick={() => setSelectedMode("settings")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-elevated transition-all duration-150 ease-out w-full"
            >
              <SettingsIcon size={18} className="text-text-tertiary" />
               <span className="text-sm font-medium leading-5">Settings</span>
            </button>
          </div>
        )}
      </div>

      {!sidebarCollapsed && (
        <div className="border-t border-border p-3 xl:p-4">
          <div className="space-y-1">
             <p className="text-xs leading-4 text-text-tertiary uppercase tracking-wider">
              Time & System
            </p>
            <ClockWidget />
          </div>

          <SystemStatus />
        </div>
      )}

      <button
        type="button"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-4 z-20 flex h-8 w-6 items-center justify-center rounded-l-lg border border-border bg-bg-secondary text-text-secondary opacity-80 transition-colors hover:bg-bg-elevated hover:text-text-primary hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>
    </aside>
  )
}
