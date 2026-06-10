'use client'

import { createColumnHelper, type RowData } from '@tanstack/react-table'
import type { Repo } from '@/shared/api/schemas'
import { formatCompact } from '@/features/overview/lib/aggregate'
import { WatchStar } from '@/features/watchlist/components/WatchStar'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    watchlist: {
      simulateFailure: boolean
      onError: (message: string) => void
    }
  }
}

const columnHelper = createColumnHelper<Repo>()

const relativeTime = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days === 0) return 'today'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export const repoColumns = [
  columnHelper.display({
    id: 'select',
    size: 40,
    enableHiding: false,
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Select all rows"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="accent-violet-500"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="accent-violet-500"
      />
    ),
  }),
  columnHelper.display({
    id: 'watch',
    size: 40,
    enableHiding: false,
    header: () => <span aria-hidden>★</span>,
    cell: ({ row, table }) => (
      <WatchStar
        repoId={row.original.id}
        repoName={row.original.name}
        simulateFailure={table.options.meta?.watchlist.simulateFailure ?? false}
        onError={table.options.meta?.watchlist.onError ?? (() => {})}
      />
    ),
  }),
  columnHelper.accessor('name', {
    header: 'Repository',
    size: 220,
    enableHiding: false,
    cell: ({ row }) => (
      <a
        href={row.original.html_url}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-zinc-100 hover:text-violet-400"
      >
        {row.original.name}
      </a>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    size: 380,
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="line-clamp-1 text-zinc-400">{getValue() ?? '—'}</span>
    ),
  }),
  columnHelper.accessor('language', {
    header: 'Language',
    size: 120,
    cell: ({ getValue }) => getValue() ?? '—',
  }),
  columnHelper.accessor('stargazers_count', {
    header: 'Stars',
    size: 90,
    cell: ({ getValue }) => `★ ${formatCompact(getValue())}`,
  }),
  columnHelper.accessor('forks_count', {
    header: 'Forks',
    size: 90,
    cell: ({ getValue }) => formatCompact(getValue()),
  }),
  columnHelper.accessor('open_issues_count', {
    header: 'Open issues',
    size: 110,
    cell: ({ getValue }) => formatCompact(getValue()),
  }),
  columnHelper.accessor('pushed_at', {
    header: 'Last push',
    size: 110,
    cell: ({ getValue }) => relativeTime(getValue()),
  }),
]
