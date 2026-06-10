import { getOrgRepos } from '@/shared/api/github'
import { formatCompact } from '../lib/aggregate'
import { Card } from '@/shared/ui/Card'

export async function TopReposCard({ org }: { org: string }) {
  const repos = await getOrgRepos(org)
  const top = repos.slice(0, 8)

  return (
    <Card title="Top repositories">
      <ul className="divide-y divide-white/[0.05]">
        {top.map((repo) => (
          <li key={repo.id} className="flex items-center justify-between gap-4 py-2.5">
            <div className="min-w-0">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-zinc-100 hover:text-violet-400"
              >
                {repo.name}
              </a>
              <p className="truncate text-xs text-zinc-500">{repo.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs tabular-nums text-zinc-400">
              <span>★ {formatCompact(repo.stargazers_count)}</span>
              <span className="hidden sm:inline">⑂ {formatCompact(repo.forks_count)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
