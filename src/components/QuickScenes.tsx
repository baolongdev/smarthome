"use client"

import { CheckIcon } from "@/components/icons"
import { useState } from "react"
import type { Scene } from "@/lib/types"
import { useStore } from "@/store/useStore"

interface QuickScenesProps {
  scenes: Scene[]
}

export function QuickScenes({ scenes }: QuickScenesProps) {
  const { sceneOrder, scenes: sceneMap, runScene } = useStore()
  const [runningScene, setRunningScene] = useState<string | null>(null)

  const orderedScenes = sceneOrder
    .map((id) => sceneMap[id])
    .filter(Boolean) as Scene[]

  const displayScenes = orderedScenes.length > 0 ? orderedScenes : scenes

  const handleRunScene = async (sceneId: string) => {
    setRunningScene(sceneId)
    try {
      runScene(sceneId)
    } catch {
      // handle
    } finally {
      setTimeout(() => setRunningScene(null), 1000)
    }
  }

  if (displayScenes.length === 0) return null

  return (
    <div className="mt-6 mb-4">
      <h3 className="mb-2 px-1 text-xs font-medium leading-4 uppercase tracking-wider text-text-tertiary">
        Quick Scenes
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {displayScenes.map((scene) => {
          const isRunning = runningScene === scene.id
          return (
            <button
              key={scene.id}
              onClick={() => handleRunScene(scene.id)}
              aria-label={`Run ${scene.name} scene`}
              disabled={isRunning}
              className={`
                relative flex items-center gap-1.5 px-3 py-1.5
                rounded-xl border border-border
                bg-bg-device-off
                text-sm font-medium leading-5
                transition-all duration-200 ease-out
                active:scale-[0.98]
                ${
                  isRunning
                    ? "text-accent border-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                }
              `}
            >
              <span className="text-xs leading-4">{scene.icon}</span>
              <span>{scene.name}</span>
              {isRunning && <CheckIcon size={12} className="text-accent" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
