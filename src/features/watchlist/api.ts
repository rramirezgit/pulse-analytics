const STORAGE_KEY = 'pulse.watchlist'
const LATENCY_MS = 600

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function read(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

function write(ids: number[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export async function getWatchlist(): Promise<number[]> {
  await delay(150)
  return read()
}

export async function toggleWatched(
  repoId: number,
  options: { simulateFailure?: boolean } = {}
): Promise<number[]> {
  await delay(LATENCY_MS)
  if (options.simulateFailure) throw new Error('Watchlist service unavailable')

  const current = read()
  const next = current.includes(repoId)
    ? current.filter((id) => id !== repoId)
    : [...current, repoId]
  write(next)
  return next
}
