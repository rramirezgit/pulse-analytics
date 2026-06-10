'use client'

import { useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useReposQuery } from '@/features/repos-table/queries'
import { useIssuesInfiniteQuery, usePrefetchIssueDetail } from '../queries'
import { IssueDetailPanel } from './IssueDetailPanel'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { IssueState } from '@/shared/api/schemas'

const STATES: IssueState[] = ['open', 'closed', 'all']
const ROW_HEIGHT = 64

export function IssuesExplorer({ org }: { org: string }) {
  const { data: repos } = useReposQuery(org)
  const [repo, setRepo] = useState('query')
  const [state, setState] = useState<IssueState>('open')
  const [selected, setSelected] = useState<number | null>(null)

  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useIssuesInfiniteQuery(org, repo, state)
  const prefetchDetail = usePrefetchIssueDetail(org, repo)

  const issues = data?.pages.flat() ?? []
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: hasNextPage ? issues.length + 1 : issues.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const lastVisibleIndex = virtualItems.at(-1)?.index ?? 0

  useEffect(() => {
    if (lastVisibleIndex >= issues.length - 1 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [lastVisibleIndex, issues.length, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <select
            value={repo}
            onChange={(event) => {
              setRepo(event.target.value)
              setSelected(null)
            }}
            aria-label="Repository"
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-violet-500/50 focus:outline-none"
          >
            {(repos ?? []).map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <div role="tablist" aria-label="Issue state" className="flex rounded-xl border border-white/10 p-0.5">
            {STATES.map((value) => (
              <button
                key={value}
                role="tab"
                aria-selected={state === value}
                onClick={() => {
                  setState(value)
                  setSelected(null)
                }}
                className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
                  state === value ? 'bg-white/[0.08] text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs tabular-nums text-zinc-500">
            {issues.length} loaded{hasNextPage ? ' · scroll for more' : ''}
          </span>
        </div>

        {isPending ? (
          <Skeleton className="h-[560px]" />
        ) : isError ? (
          <p role="alert" className="py-20 text-center text-sm text-red-400">
            {error.message}
          </p>
        ) : (
          <div
            ref={parentRef}
            className="h-[560px] overflow-y-auto rounded-2xl border border-white/[0.06]"
          >
            <div style={{ height: virtualizer.getTotalSize() }} className="relative">
              {virtualItems.map((virtualRow) => {
                const issue = issues[virtualRow.index]

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="absolute inset-x-0 top-0"
                  >
                    {issue ? (
                      <button
                        type="button"
                        onMouseEnter={() => prefetchDetail(issue.number)}
                        onFocus={() => prefetchDetail(issue.number)}
                        onClick={() => setSelected(issue.number)}
                        className={`flex h-full w-full items-center gap-3 border-b border-white/[0.04] px-4 text-left hover:bg-white/[0.03] ${
                          selected === issue.number ? 'bg-violet-500/[0.08]' : ''
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            issue.state === 'open' ? 'bg-emerald-400' : 'bg-violet-400'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-zinc-200">
                            {issue.pull_request && (
                              <span className="mr-1.5 rounded bg-cyan-500/10 px-1 py-0.5 text-[10px] uppercase text-cyan-400">
                                PR
                              </span>
                            )}
                            {issue.title}
                          </span>
                          <span className="block text-xs text-zinc-500">
                            #{issue.number}
                            {issue.user && ` · ${issue.user.login}`} · {issue.comments} comments
                          </span>
                        </span>
                      </button>
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                        Loading more…
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-white/[0.06] bg-white/[0.02] lg:col-span-2">
        <IssueDetailPanel org={org} repo={repo} number={selected} onClose={() => setSelected(null)} />
      </aside>
    </div>
  )
}
