import { IssuesExplorer } from '@/features/issues-explorer/components/IssuesExplorer'

const DEFAULT_ORG = process.env.NEXT_PUBLIC_DEFAULT_ORG ?? 'tanstack'

export const metadata = {
  title: 'Issues — Pulse',
}

export default function IssuesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Issues & PRs</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Infinite scrolling with TanStack Query, row virtualization with TanStack Virtual, and
        hover-prefetched details.
      </p>
      <div className="mt-6">
        <IssuesExplorer org={DEFAULT_ORG} />
      </div>
    </main>
  )
}
