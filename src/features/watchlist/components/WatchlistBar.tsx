'use client'

import { useWatchlistQuery } from '../queries'
import type { Repo } from '@/shared/api/schemas'

interface WatchlistBarProps {
  repos: Repo[]
  simulateFailure: boolean
  onSimulateFailureChange: (value: boolean) => void
  lastError: string | null
}

export function WatchlistBar({
  repos,
  simulateFailure,
  onSimulateFailureChange,
  lastError,
}: WatchlistBarProps) {
  const { data: watchlist = [] } = useWatchlistQuery()
  const watched = repos.filter((repo) => watchlist.includes(repo.id))

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        Watchlist
      </span>
      {watched.length === 0 ? (
        <span className="text-sm text-zinc-600">
          Star repositories below — updates are optimistic.
        </span>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {watched.map((repo) => (
            <li
              key={repo.id}
              className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300"
            >
              ★ {repo.name}
            </li>
          ))}
        </ul>
      )}
      <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-zinc-400">
        <input
          type="checkbox"
          checked={simulateFailure}
          onChange={(event) => onSimulateFailureChange(event.target.checked)}
          className="accent-red-500"
        />
        Simulate API failure
      </label>
      <span role="status" aria-live="polite" className="basis-full text-xs text-red-400">
        {lastError}
      </span>
    </div>
  )
}
