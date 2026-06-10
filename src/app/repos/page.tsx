import { ReposTable } from '@/features/repos-table/components/ReposTable'

const DEFAULT_ORG = process.env.NEXT_PUBLIC_DEFAULT_ORG ?? 'tanstack'

export const metadata = {
  title: 'Repositories — Pulse',
}

export default function ReposPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Repositories</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Sorting, global filtering, column visibility and row selection — powered by TanStack Table.
      </p>
      <div className="mt-6">
        <ReposTable org={DEFAULT_ORG} />
      </div>
    </main>
  )
}
