"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { getRoomIconOption, ROOM_ICON_OPTIONS } from "@/lib/roomIcons"
import { RoomIcon } from "./RoomIcon"

interface RoomIconPickerProps {
  value: string
  onValueChange: (value: string) => void
}

export function RoomIconPicker({ value, onValueChange }: RoomIconPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = getRoomIconOption(value)

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return ROOM_ICON_OPTIONS

    return ROOM_ICON_OPTIONS.filter((option) =>
      [option.name, option.label, ...option.keywords].some((value) => value.toLowerCase().includes(normalizedQuery)),
    )
  }, [query])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Choose room icon"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center gap-2 rounded-[var(--radius-input)] border border-border-input bg-bg-device-off px-3 text-left text-sm leading-5 text-text-primary outline-none transition-colors hover:border-border-input focus:border-accent"
      >
        <RoomIcon name={selected.name} size={19} className="shrink-0 text-text-secondary" />
        <span className="flex-1 truncate">{selected.label}</span>
        <ChevronDown size={16} className="shrink-0 text-text-tertiary" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[var(--radius-input)] border border-border bg-bg-panel max-sm:fixed max-sm:bottom-[calc(var(--mobile-nav-total)+12px)] max-sm:left-4 max-sm:right-4 max-sm:top-auto max-sm:max-h-[70dvh]">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={15} className="shrink-0 text-text-tertiary" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons..."
              aria-label="Search room icons"
              className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-text-primary outline-none placeholder:text-text-tertiary"
            />
            {query && (
              <button type="button" aria-label="Clear icon search" onClick={() => setQuery("")} className="text-text-tertiary hover:text-text-primary">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm leading-5 text-text-tertiary">No icons found</p>
            ) : (
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {filteredOptions.map((option) => {
                  const isSelected = option.name === selected.name
                  return (
                    <button
                      key={option.name}
                      type="button"
                      role="option"
                      aria-label={`Select ${option.label} icon`}
                      aria-selected={isSelected}
                      onClick={() => {
                        onValueChange(option.name)
                        setOpen(false)
                        setQuery("")
                      }}
                      className={cn(
                        "relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-center transition-colors duration-150 hover:border-border-input hover:bg-bg-elevated",
                        isSelected ? "border-accent bg-bg-elevated text-accent" : "border-border text-text-secondary",
                      )}
                    >
                      <RoomIcon name={option.name} size={22} />
                      <span className="w-full truncate text-[11px] leading-4">{option.label}</span>
                      {isSelected && <Check size={12} className="absolute right-1 top-1 text-accent" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
