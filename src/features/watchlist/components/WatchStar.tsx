'use client'

import { useWatchlistQuery, useToggleWatchedMutation } from '../queries'

interface WatchStarProps {
  repoId: number
  repoName: string
  simulateFailure: boolean
  onError: (message: string) => void
}

export function WatchStar({ repoId, repoName, simulateFailure, onError }: WatchStarProps) {
  const { data: watchlist = [] } = useWatchlistQuery()
  const toggle = useToggleWatchedMutation({ simulateFailure })
  const watched = watchlist.includes(repoId)

  return (
    <button
      type="button"
      aria-label={watched ? `Unwatch ${repoName}` : `Watch ${repoName}`}
      aria-pressed={watched}
      onClick={() =>
        toggle.mutate(repoId, {
          onError: () =>
            onError(`Couldn't update "${repoName}" — the change was rolled back.`),
        })
      }
      className={`text-base transition-transform hover:scale-110 ${
        watched ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
      }`}
    >
      {watched ? '★' : '☆'}
    </button>
  )
}
