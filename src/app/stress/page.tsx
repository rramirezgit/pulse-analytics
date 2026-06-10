import { StressTable } from '@/features/stress-test/components/StressTable'

export const metadata = {
  title: 'Stress Test — Pulse',
}

export default function StressPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Stress Test</h1>
      <p className="mt-1 text-sm text-zinc-400">
        100,000 synthetic rows (fixed seed, generated client-side) sorted by TanStack Table and
        rendered through TanStack Virtual — only the visible slice touches the DOM.
      </p>
      <div className="mt-6">
        <StressTable />
      </div>
    </main>
  )
}
