'use client'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { useReposQuery } from '../queries'
import { repoColumns } from '../columns'
import { Skeleton } from '@/shared/ui/Skeleton'
import { WatchlistBar } from '@/features/watchlist/components/WatchlistBar'

export function ReposTable({ org }: { org: string }) {
  const { data, isPending, isError, error } = useReposQuery(org)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'stargazers_count', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const table = useReactTable({
    data: data ?? [],
    columns: repoColumns,
    state: { sorting, globalFilter, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { columnPinning: { left: ['select', 'name'] } },
    getRowId: (repo) => String(repo.id),
    meta: { watchlist: { simulateFailure, onError: setLastError } },
  })

  if (isPending) return <Skeleton className="h-96" />
  if (isError) {
    return (
      <p role="alert" className="py-20 text-center text-sm text-red-400">
        {error.message}
      </p>
    )
  }

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="space-y-3">
      <WatchlistBar
        repos={data ?? []}
        simulateFailure={simulateFailure}
        onSimulateFailureChange={setSimulateFailure}
        lastError={lastError}
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Filter repositories…"
          aria-label="Filter repositories"
          className="w-64 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
        />
        <details className="relative">
          <summary className="cursor-pointer select-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300">
            Columns
          </summary>
          <div className="absolute z-10 mt-2 w-48 rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-xl">
            {table
              .getAllLeafColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <label key={column.id} className="flex items-center gap-2 py-1 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="accent-violet-500"
                  />
                  {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                </label>
              ))}
          </div>
        </details>
        <span className="ml-auto text-xs tabular-nums text-zinc-500">
          {selectedCount > 0 && `${selectedCount} selected · `}
          {table.getFilteredRowModel().rows.length} repositories
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500"
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-zinc-300"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: '↑', desc: '↓' }[header.column.getIsSorted() as string] ?? ''}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-selected={row.getIsSelected() || undefined}
                className="hover:bg-white/[0.02] data-selected:bg-violet-500/[0.07]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2.5 text-zinc-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
