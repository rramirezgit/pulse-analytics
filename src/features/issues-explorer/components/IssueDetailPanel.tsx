'use client'

import { useIssueDetailQuery } from '../queries'
import { Skeleton } from '@/shared/ui/Skeleton'

interface IssueDetailPanelProps {
  org: string
  repo: string
  number: number | null
  onClose: () => void
}

export function IssueDetailPanel({ org, repo, number, onClose }: IssueDetailPanelProps) {
  const { data, isPending } = useIssueDetailQuery(org, repo, number)

  if (number === null) {
    return (
      <p className="hidden p-6 text-sm text-zinc-600 lg:block">
        Hover a row to prefetch it, click to open the detail.
      </p>
    )
  }

  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs tabular-nums text-zinc-500">#{number}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close issue detail"
          className="rounded-lg px-2 py-0.5 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"
        >
          ✕
        </button>
      </div>

      {isPending || !data ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <>
          <h3 className="mt-1 text-base font-semibold text-zinc-100">{data.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span
              className={`rounded-full px-2 py-0.5 ${
                data.state === 'open'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-violet-500/10 text-violet-400'
              }`}
            >
              {data.state}
            </span>
            {data.user && <span>by {data.user.login}</span>}
            <span>{data.comments} comments</span>
          </div>
          <div className="mt-4 flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
            {data.body?.slice(0, 3000) ?? 'No description provided.'}
          </div>
          <a
            href={data.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 text-sm text-violet-400 hover:text-violet-300"
          >
            Open on GitHub →
          </a>
        </>
      )}
    </div>
  )
}
