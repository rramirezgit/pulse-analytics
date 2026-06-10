'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWatchlist, toggleWatched } from './api'

export const watchlistKey = ['watchlist'] as const

export function useWatchlistQuery() {
  return useQuery({ queryKey: watchlistKey, queryFn: getWatchlist })
}

interface ToggleContext {
  previous: number[] | undefined
}

export function useToggleWatchedMutation(options: { simulateFailure?: boolean } = {}) {
  const queryClient = useQueryClient()

  return useMutation<number[], Error, number, ToggleContext>({
    mutationFn: (repoId) => toggleWatched(repoId, options),
    onMutate: async (repoId) => {
      await queryClient.cancelQueries({ queryKey: watchlistKey })
      const previous = queryClient.getQueryData<number[]>(watchlistKey)

      queryClient.setQueryData<number[]>(watchlistKey, (current = []) =>
        current.includes(repoId)
          ? current.filter((id) => id !== repoId)
          : [...current, repoId]
      )

      return { previous }
    },
    onError: (_error, _repoId, context) => {
      queryClient.setQueryData(watchlistKey, context?.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKey })
    },
  })
}
