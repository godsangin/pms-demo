import { cn } from '@/shared/lib/cn'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { StatusSignal } from '@/shared/types/pms'
import type { ReactNode } from 'react'

type Tone = 'green' | 'yellow' | 'red' | 'zinc' | 'blue'

const toneClass: Record<Tone, string> = {
  green: 'bg-green-50 text-green-800 ring-1 ring-inset ring-green-200',
  yellow: 'bg-yellow-50 text-yellow-900 ring-1 ring-inset ring-yellow-200',
  red: 'bg-red-50 text-red-800 ring-1 ring-inset ring-red-200',
  zinc: 'bg-zinc-50 text-zinc-800 ring-1 ring-inset ring-zinc-200',
  blue: 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200',
}

export function Badge({
  children,
  tone = 'zinc',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-tight',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: StatusSignal }) {
  const { t } = useI18n()
  if (status === 'GREEN') return <Badge tone="green">{t('status.green')}</Badge>
  if (status === 'YELLOW') return <Badge tone="yellow">{t('status.yellow')}</Badge>
  return <Badge tone="red">{t('status.red')}</Badge>
}
