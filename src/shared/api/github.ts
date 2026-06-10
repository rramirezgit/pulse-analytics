import 'server-only'
import type { z } from 'zod'
import { orgSchema, repoListSchema, participationSchema } from './schemas'
import type { Org, Repo, Participation } from './schemas'

const GITHUB_API = 'https://api.github.com'
const REVALIDATE_SECONDS = 900

export class GithubApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string
  ) {
    super(`GitHub API ${status} on ${path}`)
    this.name = 'GithubApiError'
  }
}

async function githubFetch<Schema extends z.ZodType>(
  path: string,
  schema: Schema
): Promise<z.infer<Schema>> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) throw new GithubApiError(response.status, path)

  return schema.parse(await response.json())
}

export function getOrg(org: string): Promise<Org> {
  return githubFetch(`/orgs/${org}`, orgSchema)
}

export async function getOrgRepos(org: string): Promise<Repo[]> {
  const repos = await githubFetch(`/orgs/${org}/repos?per_page=100&sort=pushed`, repoListSchema)
  return repos
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
}

export async function getRepoParticipation(
  fullName: string
): Promise<Participation | null> {
  try {
    const response = await fetch(`${GITHUB_API}/repos/${fullName}/stats/participation`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (response.status !== 200) return null
    return participationSchema.parse(await response.json())
  } catch {
    return null
  }
}
