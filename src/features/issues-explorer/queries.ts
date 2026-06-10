'use client'

import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { issueListSchema, issueDetailSchema } from '@/shared/api/schemas'
import type { Issue, IssueDetail, IssueState } from '@/shared/api/schemas'

const PAGE_SIZE = 30

const issueKeys = {
  list: (org: string, repo: string, state: IssueState) =>
    ['issues', org, repo, { state }] as const,
  detail: (org: string, repo: string, number: number) =>
    ['issue', org, repo, number] as const,
}

async function fetchIssuesPage(
  org: string,
  repo: string,
  state: IssueState,
  page: number
): Promise<Issue[]> {
  const params = new URLSearchParams({ org, repo, state, page: String(page) })
  const response = await fetch(`/api/github/issues?${params}`)
  if (!response.ok) throw new Error(`Failed to load issues (${response.status})`)
  return issueListSchema.parse(await response.json())
}

async function fetchIssueDetail(
  org: string,
  repo: string,
  number: number
): Promise<IssueDetail> {
  const params = new URLSearchParams({ org, repo, number: String(number) })
  const response = await fetch(`/api/github/issue?${params}`)
  if (!response.ok) throw new Error(`Failed to load issue #${number} (${response.status})`)
  return issueDetailSchema.parse(await response.json())
}

export function useIssuesInfiniteQuery(org: string, repo: string, state: IssueState) {
  return useInfiniteQuery({
    queryKey: issueKeys.list(org, repo, state),
    queryFn: ({ pageParam }) => fetchIssuesPage(org, repo, state, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined,
  })
}

export function useIssueDetailQuery(org: string, repo: string, number: number | null) {
  return useQuery({
    queryKey: issueKeys.detail(org, repo, number ?? 0),
    queryFn: () => fetchIssueDetail(org, repo, number ?? 0),
    enabled: number !== null,
  })
}

export function usePrefetchIssueDetail(org: string, repo: string) {
  const queryClient = useQueryClient()

  return useCallback(
    (number: number) => {
      void queryClient.prefetchQuery({
        queryKey: issueKeys.detail(org, repo, number),
        queryFn: () => fetchIssueDetail(org, repo, number),
        staleTime: 5 * 60 * 1000,
      })
    },
    [queryClient, org, repo]
  )
}
