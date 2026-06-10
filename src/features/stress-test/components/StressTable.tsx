'use client'

import { useMemo, useRef, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { generateRows, type StressRow } from '../lib/dataset'
import { useFps } from '../lib/useFps'

const ROW_COUNT = 100_000
const ROW_HEIGHT = 40

const STATUS_STYLES: Record<StressRow['status'], string> = {
  healthy: 'bg-emerald-500/10 text-emerald-400',
  degraded: 'bg-amber-500/10 text-amber-400',
  down: 'bg-red-500/10 text-red-400',
}

const columnHelper = createColumnHelper<StressRow>()

const columns = [
  columnHelper.accessor('id', { header: '#', size: 80 }),
  columnHelper.accessor('name', { header: 'Service', size: 180 }),
  columnHelper.accessor('category', { header: 'Category', size: 120 }),
  columnHelper.accessor('region', { header: 'Region', size: 120 }),
  columnHelper.accessor('value', {
    header: 'Value',
    size: 110,
    cell: ({ getValue }) => getValue().toFixed(2),
  }),
  columnHelper.accessor('delta', {
    header: 'Δ 24h',
    size: 100,
    cell: ({ getValue }) => {
      const delta = getValue()
      return (
        <span className={delta >= 0 ? 'text-emerald-400' : 'text-red-400'}>
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(2)}
        </span>
      )
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 110,
    cell: ({ getValue }) => (
      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[getValue()]}`}>
        {getValue()}
      </span>
    ),
  }),
]

export function StressTable() {
  const data = useMemo(() => generateRows(ROW_COUNT), [])
  const [sorting, setSorting] = useState<SortingState>([])
  const fps = useFps()

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
        <span className="tabular-nums">
          {ROW_COUNT.toLocaleString('en')} rows · seed-deterministic dataset generated in the
          browser
        </span>
        <span
          className={`ml-auto rounded-xl border border-white/10 px-3 py-1.5 font-mono text-xs tabular-nums ${
            fps >= 50 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-red-400'
          }`}
          aria-label="Frames per second"
        >
          {fps} fps
        </span>
        <span className="text-xs text-zinc-600">
          {virtualizer.getVirtualItems().length} rows in the DOM
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
        <div className="flex bg-white/[0.03]">
          {table.getFlatHeaders().map((header) => (
            <button
              key={header.id}
              type="button"
              style={{ width: header.getSize() }}
              onClick={header.column.getToggleSortingHandler()}
              className="flex shrink-0 items-center gap-1 px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-zinc-300"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{ asc: '↑', desc: '↓' }[header.column.getIsSorted() as string] ?? ''}
            </button>
          ))}
        </div>

        <div ref={parentRef} className="h-[600px] overflow-y-auto">
          <div style={{ height: virtualizer.getTotalSize() }} className="relative">
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <div
                  key={row.id}
                  style={{
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="absolute inset-x-0 top-0 flex border-b border-white/[0.03] text-sm text-zinc-300 hover:bg-white/[0.02]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="flex shrink-0 items-center px-3 tabular-nums"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
