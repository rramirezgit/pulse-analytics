'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/repos', label: 'Repositories' },
  { href: '/issues', label: 'Issues' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/[0.06]">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-50">
          Pulse<span className="text-violet-400">.</span>
        </Link>
        <div className="flex gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  active ? 'bg-white/[0.06] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
