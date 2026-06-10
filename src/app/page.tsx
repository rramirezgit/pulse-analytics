import { Suspense } from 'react'
import { OrgHeader } from '@/features/overview/components/OrgHeader'
import { KpiGrid } from '@/features/overview/components/KpiGrid'
import { TopReposCard } from '@/features/overview/components/TopReposCard'
import { LanguagesCard } from '@/features/overview/components/LanguagesCard'
import { ActivityCard } from '@/features/overview/components/ActivityCard'
import { Skeleton } from '@/shared/ui/Skeleton'

const DEFAULT_ORG = process.env.NEXT_PUBLIC_DEFAULT_ORG ?? 'tanstack'

export default function OverviewPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <Suspense fallback={<Skeleton className="h-14 w-96 max-w-full" />}>
        <OrgHeader org={DEFAULT_ORG} />
      </Suspense>

      <div className="mt-8 space-y-4">
        <Suspense fallback={<Skeleton className="h-28" />}>
          <KpiGrid org={DEFAULT_ORG} />
        </Suspense>

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Suspense fallback={<Skeleton className="h-80" />}>
              <ActivityCard org={DEFAULT_ORG} />
            </Suspense>
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={<Skeleton className="h-80" />}>
              <LanguagesCard org={DEFAULT_ORG} />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-96" />}>
          <TopReposCard org={DEFAULT_ORG} />
        </Suspense>
      </div>
    </main>
  )
}
