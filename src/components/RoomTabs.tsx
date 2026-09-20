"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons"
import { useEffect, useRef, useState } from "react"
import type { Room } from "@/lib/types"
import { useStore } from "@/store/useStore"

interface RoomTabsProps {
  rooms: Room[]
}

export function RoomTabs({ rooms }: RoomTabsProps) {
  const { selectedRoom, selectRoom } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const roomButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
        setShowLeft(scrollLeft > 5)
        setShowRight(scrollLeft + clientWidth < scrollWidth - 5)
      }
    }

    checkOverflow()
    const container = containerRef.current
    container?.addEventListener("scroll", checkOverflow)

    const resizeObserver = container ? new ResizeObserver(checkOverflow) : null
    if (resizeObserver && container) {
      resizeObserver.observe(container)
    }

    window.addEventListener("resize", checkOverflow)

    return () => {
      container?.removeEventListener("scroll", checkOverflow)
      resizeObserver?.disconnect()
      window.removeEventListener("resize", checkOverflow)
    }
  }, [rooms])

  useEffect(() => {
    if (!selectedRoom) return

    const container = containerRef.current
    const activeButton = roomButtonRefs.current[selectedRoom]
    if (!container || !activeButton) return

    const targetLeft = activeButton.offsetLeft - (container.clientWidth - activeButton.offsetWidth) / 2
    const maxScrollLeft = container.scrollWidth - container.clientWidth

    container.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScrollLeft)),
      behavior: "smooth",
    })
  }, [selectedRoom])

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(".app-scroll-container")
    if (!scrollContainer || rooms.length === 0) return

    const sections = rooms
      .map((room) => document.getElementById(`room-${room.id}`))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    let frame: number | null = null

    const updateActiveRoom = () => {
      frame = null

      const containerTop = scrollContainer.getBoundingClientRect().top
      const stickyHeight = document.querySelector<HTMLElement>(".room-tabs-sticky")?.getBoundingClientRect().height ?? 0
      const activationLine = containerTop + stickyHeight + 8

      let activeSection = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) {
          activeSection = section
        } else {
          break
        }
      }

      const activeRoomId = activeSection.id.replace("room-", "")
      if (activeRoomId !== useStore.getState().selectedRoom) {
        selectRoom(activeRoomId)
      }
    }

    const handleScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(updateActiveRoom)
      }
    }

    updateActiveRoom()
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [rooms, selectRoom])

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const amount = 180
      const scrollAmount = direction === "left" ? -amount : amount
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleRoomSelect = (roomId: string) => {
    selectRoom(roomId)

    requestAnimationFrame(() => {
      const target = document.getElementById(`room-${roomId}`)
      const scrollContainer = target?.closest<HTMLElement>(".app-scroll-container")
      const stickyHeader = document.querySelector<HTMLElement>(".room-tabs-sticky")

      if (!target || !scrollContainer) return

      const targetTop = target.getBoundingClientRect().top
      const containerTop = scrollContainer.getBoundingClientRect().top
      const headerHeight = stickyHeader?.getBoundingClientRect().height ?? 0

      scrollContainer.scrollBy({
        top: targetTop - containerTop - headerHeight,
        behavior: "smooth",
      })
    })
  }

  return (
    <div className="room-tabs-sticky relative mb-6 -mx-5 px-5 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      <div className="flex min-w-0 items-center gap-1">
        {showLeft && (
          <button
            type="button"
            aria-label="Scroll rooms left"
            onClick={() => scroll("left")}
            className="flex h-10 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-panel/90 text-text-secondary transition-all hover:text-text-primary"
          >
            <ChevronLeftIcon size={14} className="text-text-secondary" />
          </button>
        )}

        <div
          ref={containerRef}
          className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto scrollbar-hide pb-1"
        >
          {rooms.map((room) => {
            const isActive = selectedRoom === room.id
            return (
              <button
                key={room.id}
                ref={(element) => {
                  roomButtonRefs.current[room.id] = element
                }}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleRoomSelect(room.id)}
                className={`
                  flex flex-shrink-0 flex-col items-center justify-center gap-1 text-center
                  px-1 pb-2
                  transition-all duration-200
                  ${isActive ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}
                `}
              >
                <span className="text-sm font-medium leading-5 whitespace-nowrap">{room.name}</span>
                {isActive && (
                  <span
                    className="block h-0.5 bg-accent rounded-full transition-all duration-200"
                    style={{ width: isActive ? "24px" : "0px" }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {showRight && (
          <button
            type="button"
            aria-label="Scroll rooms right"
            onClick={() => scroll("right")}
            className="flex h-10 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-panel/90 text-text-secondary transition-all hover:text-text-primary"
          >
            <ChevronRightIcon size={14} className="text-text-secondary" />
          </button>
        )}
      </div>
    </div>
  )
}
