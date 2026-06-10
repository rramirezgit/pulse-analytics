import { NextResponse } from 'next/server'
import { getOrgRepos, GithubApiError } from '@/shared/api/github'

export async function GET(request: Request) {
  const org = new URL(request.url).searchParams.get('org')
  if (!org) return NextResponse.json({ error: 'Missing org parameter' }, { status: 400 })

  try {
    const repos = await getOrgRepos(org)
    return NextResponse.json(repos)
  } catch (error) {
    if (error instanceof GithubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
