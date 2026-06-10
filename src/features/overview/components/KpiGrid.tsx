import { getOrgRepos } from '@/shared/api/github'
import { computeKpis, formatCompact } from '../lib/aggregate'
import { Card } from '@/shared/ui/Card'

const KPI_LABELS: Record<keyof ReturnType<typeof computeKpis>, string> = {
  totalStars: 'Total stars',
  totalForks: 'Total forks',
  openIssues: 'Open issues',
  repoCount: 'Active repos',
}

export async function KpiGrid({ org }: { org: string }) {
  const repos = await getOrgRepos(org)
  const kpis = computeKpis(repos)

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {(Object.keys(KPI_LABELS) as (keyof typeof KPI_LABELS)[]).map((key) => (
        <Card key={key}>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {KPI_LABELS[key]}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-50">
            {formatCompact(kpis[key])}
          </p>
        </Card>
      ))}
    </div>
  )
}
