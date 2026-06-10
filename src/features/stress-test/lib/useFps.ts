'use client'

import { useEffect, useState } from 'react'

export function useFps(): number {
  const [fps, setFps] = useState(0)

  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let rafId = 0

    const loop = (now: number) => {
      frames += 1
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)))
        frames = 0
        last = now
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return fps
}
