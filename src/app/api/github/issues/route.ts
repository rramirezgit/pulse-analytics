import { NextResponse } from 'next/server'
import { getRepoIssues, GithubApiError } from '@/shared/api/github'
import type { IssueState } from '@/shared/api/schemas'

const VALID_STATES: IssueState[] = ['open', 'closed', 'all']

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const org = params.get('org')
  const repo = params.get('repo')
  const state = params.get('state') ?? 'open'
  const page = Number(params.get('page') ?? '1')

  if (!org || !repo) {
    return NextResponse.json({ error: 'Missing org or repo parameter' }, { status: 400 })
  }
  if (!VALID_STATES.includes(state as IssueState) || !Number.isInteger(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid state or page parameter' }, { status: 400 })
  }

  try {
    const issues = await getRepoIssues(org, repo, state as IssueState, page)
    return NextResponse.json(issues)
  } catch (error) {
    if (error instanceof GithubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
