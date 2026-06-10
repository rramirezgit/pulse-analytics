export interface StressRow {
  id: number
  name: string
  category: string
  region: string
  value: number
  delta: number
  status: 'healthy' | 'degraded' | 'down'
}

const CATEGORIES = ['ingest', 'compute', 'storage', 'network', 'auth', 'billing']
const REGIONS = ['us-east', 'us-west', 'eu-central', 'sa-east', 'ap-south']
const STATUSES: StressRow['status'][] = ['healthy', 'degraded', 'down']

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateRows(count: number, seed = 2026): StressRow[] {
  const random = mulberry32(seed)
  const rows = new Array<StressRow>(count)

  for (let i = 0; i < count; i++) {
    rows[i] = {
      id: i + 1,
      name: `service-${(i + 1).toString(36).padStart(5, '0')}`,
      category: CATEGORIES[Math.floor(random() * CATEGORIES.length)],
      region: REGIONS[Math.floor(random() * REGIONS.length)],
      value: Math.round(random() * 100_000) / 100,
      delta: Math.round((random() - 0.5) * 2_000) / 100,
      status: STATUSES[Math.floor(random() * STATUSES.length)],
    }
  }

  return rows
}
