import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useToggleWatchedMutation, watchlistKey } from './queries'
import * as api from './api'

vi.mock('./api')

const mockedToggle = vi.mocked(api.toggleWatched)

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useToggleWatchedMutation', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    queryClient.setQueryData<number[]>(watchlistKey, [1])
  })

  it('applies the toggle optimistically before the request resolves', async () => {
    const deferred = createDeferred<number[]>()
    mockedToggle.mockReturnValue(deferred.promise)

    const { result } = renderHook(() => useToggleWatchedMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate(42)

    await waitFor(() =>
      expect(queryClient.getQueryData<number[]>(watchlistKey)).toEqual([1, 42])
    )

    deferred.resolve([1, 42])
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('removes an already watched id optimistically', async () => {
    const deferred = createDeferred<number[]>()
    mockedToggle.mockReturnValue(deferred.promise)

    const { result } = renderHook(() => useToggleWatchedMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate(1)

    await waitFor(() =>
      expect(queryClient.getQueryData<number[]>(watchlistKey)).toEqual([])
    )

    deferred.resolve([])
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rolls back to the snapshot when the mutation fails', async () => {
    const deferred = createDeferred<number[]>()
    mockedToggle.mockReturnValue(deferred.promise)

    const { result } = renderHook(() => useToggleWatchedMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate(42)

    await waitFor(() =>
      expect(queryClient.getQueryData<number[]>(watchlistKey)).toEqual([1, 42])
    )

    deferred.reject(new Error('Watchlist service unavailable'))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(queryClient.getQueryData<number[]>(watchlistKey)).toEqual([1])
  })

  it('invalidates the watchlist query after settling', async () => {
    mockedToggle.mockResolvedValue([1, 42])
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useToggleWatchedMutation(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate(42)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: watchlistKey })
  })
})
