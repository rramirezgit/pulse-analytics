import Image from 'next/image'
import { getOrg } from '@/shared/api/github'

export async function OrgHeader({ org }: { org: string }) {
  const data = await getOrg(org)

  return (
    <header className="flex items-center gap-4">
      <Image
        src={data.avatar_url}
        alt={`${data.login} avatar`}
        width={56}
        height={56}
        className="rounded-2xl border border-white/10"
        priority
      />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {data.name ?? data.login}
        </h1>
        <p className="max-w-xl text-sm text-zinc-400">{data.description}</p>
      </div>
    </header>
  )
}
