import type { Repo } from '@/shared/api/schemas'

export interface OrgKpis {
  totalStars: number
  totalForks: number
  openIssues: number
  repoCount: number
}

export function computeKpis(repos: Repo[]): OrgKpis {
  return repos.reduce<OrgKpis>(
    (acc, repo) => ({
      totalStars: acc.totalStars + repo.stargazers_count,
      totalForks: acc.totalForks + repo.forks_count,
      openIssues: acc.openIssues + repo.open_issues_count,
      repoCount: acc.repoCount + 1,
    }),
    { totalStars: 0, totalForks: 0, openIssues: 0, repoCount: 0 }
  )
}

export interface LanguageSlice {
  name: string
  count: number
}

export function languageBreakdown(repos: Repo[], limit = 6): LanguageSlice[] {
  const counts = new Map<string, number>()
  for (const repo of repos) {
    if (!repo.language) continue
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
  }

  const sorted = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  if (sorted.length <= limit) return sorted

  const top = sorted.slice(0, limit - 1)
  const rest = sorted.slice(limit - 1).reduce((sum, slice) => sum + slice.count, 0)
  return [...top, { name: 'Other', count: rest }]
}

export function formatCompact(value: number): string {
  return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
