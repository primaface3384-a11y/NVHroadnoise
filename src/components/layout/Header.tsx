'use client'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="bg-slate-900 border-b border-slate-700 px-4 py-3"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
    >
      <h1 className="text-lg font-bold text-slate-100">{title}</h1>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      )}
    </header>
  )
}
