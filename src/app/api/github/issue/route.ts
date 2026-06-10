import { NextResponse } from 'next/server'
import { getIssue, GithubApiError } from '@/shared/api/github'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const org = params.get('org')
  const repo = params.get('repo')
  const number = Number(params.get('number'))

  if (!org || !repo || !Number.isInteger(number) || number < 1) {
    return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 })
  }

  try {
    const issue = await getIssue(org, repo, number)
    return NextResponse.json(issue)
  } catch (error) {
    if (error instanceof GithubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
