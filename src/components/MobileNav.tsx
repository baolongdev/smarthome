"use client"

import type { ComponentType } from "react"
import { Monitor } from "lucide-react"
import { HomeIcon, LayoutGridIcon, PlayIcon, SettingsIcon } from "@/components/icons"
import { useStore } from "@/store/useStore"

type NavIcon = ComponentType<{ size?: number; className?: string }>

const navItems: { id: "home" | "rooms" | "devices" | "scenes" | "settings"; label: string; icon: NavIcon }[] = [
  { id: "home", label: "Home", icon: HomeIcon as NavIcon },
  { id: "rooms", label: "Rooms", icon: LayoutGridIcon as NavIcon },
  { id: "devices", label: "Devices", icon: Monitor as NavIcon },
  { id: "scenes", label: "Scenes", icon: PlayIcon as NavIcon },
  { id: "settings", label: "More", icon: SettingsIcon as NavIcon },
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const { selectedMode, setSelectedMode } = useStore()

  return (
    <nav
      className={`
        ${className}
        mobile-nav fixed bottom-0 left-0 right-0 z-20
        bg-bg-secondary border-t border-border
        transition-all duration-200 ease-out
      `}
    >
      <div className="mobile-nav-items flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = selectedMode === item.id
          return (
            <button
              key={item.id}
              onClick={() => setSelectedMode(item.id)}
              className={`
                relative flex h-full w-[calc(100%_/_5)] flex-col items-center justify-center gap-1
                py-2
                transition-all duration-150 ease-out
              `}
            >
              <Icon
                size={20}
                className={isActive ? "text-accent" : "text-text-tertiary"}
              />
              <span
                className={`
                  text-xs font-medium leading-4
                  ${isActive ? "text-text-primary" : "text-text-tertiary"}
                `}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
