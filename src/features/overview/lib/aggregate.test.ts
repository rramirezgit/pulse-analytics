import { describe, it, expect } from 'vitest'
import { computeKpis, languageBreakdown, formatCompact } from './aggregate'
import type { Repo } from '@/shared/api/schemas'

const repo = (overrides: Partial<Repo>): Repo => ({
  id: 1,
  name: 'repo',
  full_name: 'org/repo',
  html_url: 'https://github.com/org/repo',
  description: null,
  stargazers_count: 0,
  forks_count: 0,
  open_issues_count: 0,
  language: null,
  pushed_at: '2026-01-01T00:00:00Z',
  archived: false,
  fork: false,
  ...overrides,
})

describe('computeKpis', () => {
  it('sums stars, forks and issues across repos', () => {
    const kpis = computeKpis([
      repo({ id: 1, stargazers_count: 10, forks_count: 2, open_issues_count: 1 }),
      repo({ id: 2, stargazers_count: 5, forks_count: 3, open_issues_count: 4 }),
    ])
    expect(kpis).toEqual({ totalStars: 15, totalForks: 5, openIssues: 5, repoCount: 2 })
  })

  it('returns zeros for an empty list', () => {
    expect(computeKpis([])).toEqual({
      totalStars: 0,
      totalForks: 0,
      openIssues: 0,
      repoCount: 0,
    })
  })
})

describe('languageBreakdown', () => {
  it('counts repos per language sorted descending', () => {
    const breakdown = languageBreakdown([
      repo({ id: 1, language: 'TypeScript' }),
      repo({ id: 2, language: 'TypeScript' }),
      repo({ id: 3, language: 'Rust' }),
      repo({ id: 4, language: null }),
    ])
    expect(breakdown).toEqual([
      { name: 'TypeScript', count: 2 },
      { name: 'Rust', count: 1 },
    ])
  })

  it('groups the tail into Other beyond the limit', () => {
    const repos = ['A', 'B', 'C', 'D'].map((language, index) =>
      repo({ id: index, language })
    )
    const breakdown = languageBreakdown(repos, 3)
    expect(breakdown).toHaveLength(3)
    expect(breakdown.at(-1)).toEqual({ name: 'Other', count: 2 })
  })
})

describe('formatCompact', () => {
  it('abbreviates large numbers', () => {
    expect(formatCompact(119800)).toBe('119.8K')
    expect(formatCompact(950)).toBe('950')
    expect(formatCompact(2_400_000)).toBe('2.4M')
  })
})
