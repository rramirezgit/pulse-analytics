import { z } from 'zod'

export const orgSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  public_repos: z.number(),
  followers: z.number(),
})

export const repoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  language: z.string().nullable(),
  pushed_at: z.string(),
  archived: z.boolean(),
  fork: z.boolean(),
})

export const repoListSchema = z.array(repoSchema)

export const participationSchema = z.object({
  all: z.array(z.number()),
  owner: z.array(z.number()),
})

export const issueSchema = z.object({
  id: z.number(),
  number: z.number(),
  title: z.string(),
  html_url: z.string().url(),
  state: z.enum(['open', 'closed']),
  comments: z.number(),
  created_at: z.string(),
  user: z.object({ login: z.string(), avatar_url: z.string().url() }).nullable(),
  labels: z.array(
    z.object({ name: z.string().optional(), color: z.string().optional() }).loose()
  ),
  pull_request: z.object({}).loose().optional(),
})

export const issueListSchema = z.array(issueSchema)

export const issueDetailSchema = issueSchema.extend({
  body: z.string().nullable(),
})

export type Org = z.infer<typeof orgSchema>
export type Repo = z.infer<typeof repoSchema>
export type Participation = z.infer<typeof participationSchema>
export type Issue = z.infer<typeof issueSchema>
export type IssueDetail = z.infer<typeof issueDetailSchema>
export type IssueState = 'open' | 'closed' | 'all'
