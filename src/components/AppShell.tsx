"use client"

import { useEffect, useState } from "react"

import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { DeviceDetailPanel } from "./DeviceDetailPanel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 64rem)")
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches)

    updateDesktopState()
    mediaQuery.addEventListener("change", updateDesktopState)

    return () => mediaQuery.removeEventListener("change", updateDesktopState)
  }, [])

  const scrollContent = (
    <div className="app-scroll-container h-full min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="app-scroll-content min-h-full w-full p-5 md:p-6 lg:p-8">
        {children}
        <div aria-hidden="true" className="mobile-bottom-spacer" />
      </div>
    </div>
  )

  return (
    <>
      <div className="flex h-[100dvh] w-full min-h-0 bg-bg-primary text-text-primary overflow-hidden">
        <Sidebar />

        <main className="relative z-0 flex h-full min-h-0 min-w-0 flex-1 overflow-hidden bg-bg-primary">
          {isDesktop ? (
            <ResizablePanelGroup orientation="horizontal" className="min-h-0 min-w-0">
              <ResizablePanel minSize="320px">
                {scrollContent}
              </ResizablePanel>
              <ResizableHandle aria-label="Resize dashboard and device details" />
              <ResizablePanel defaultSize="360px" minSize="280px" maxSize="480px">
                <div className="h-full min-w-0 overflow-y-auto overflow-x-hidden">
                  <DeviceDetailPanel />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            scrollContent
          )}
        </main>
      </div>

      <MobileNav className="lg:hidden" />
    </>
  )
}
