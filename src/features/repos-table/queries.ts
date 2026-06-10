'use client'

import { useQuery } from '@tanstack/react-query'
import { repoListSchema, type Repo } from '@/shared/api/schemas'
import { queryKeys } from '@/shared/api/queryKeys'

async function fetchRepos(org: string): Promise<Repo[]> {
  const response = await fetch(`/api/github/repos?org=${encodeURIComponent(org)}`)
  if (!response.ok) throw new Error(`Failed to load repositories (${response.status})`)
  return repoListSchema.parse(await response.json())
}

export function useReposQuery(org: string) {
  return useQuery({
    queryKey: queryKeys.repos(org),
    queryFn: () => fetchRepos(org),
  })
}
