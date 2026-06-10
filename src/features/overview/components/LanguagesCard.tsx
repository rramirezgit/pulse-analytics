import { getOrgRepos } from '@/shared/api/github'
import { languageBreakdown } from '../lib/aggregate'
import { Card } from '@/shared/ui/Card'
import { LanguageDonut } from './LanguageDonut'

export async function LanguagesCard({ org }: { org: string }) {
  const repos = await getOrgRepos(org)
  const languages = languageBreakdown(repos)

  return (
    <Card title="Languages">
      <LanguageDonut data={languages} />
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {languages.map((language) => (
          <li key={language.name} className="text-xs text-zinc-400">
            {language.name} <span className="tabular-nums text-zinc-500">({language.count})</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
