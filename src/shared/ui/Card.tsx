import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  className?: string
  children: ReactNode
}

export function Card({ title, className = '', children }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-500">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
