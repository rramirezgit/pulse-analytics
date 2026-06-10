export const queryKeys = {
  repos: (org: string) => ['repos', org] as const,
  issues: (org: string, repo: string, filters: Record<string, string>) =>
    ['issues', org, repo, filters] as const,
}
