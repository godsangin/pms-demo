import type { ProgramItem, ProgramStatus } from '@/shared/types/pms'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { formatIsoDate } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Table, type Column } from '@/shared/ui/Table'

function parseIsoDateLocal(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map((v) => Number(v))
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function delayDays(baselineEnd: string, actualEnd: string) {
  const b = parseIsoDateLocal(baselineEnd)
  const a = parseIsoDateLocal(actualEnd)
  return Math.round((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000))
}

function statusTone(status: ProgramStatus) {
  if (status === 'DONE') return 'green'
  if (status === 'BLOCKED') return 'red'
  if (status === 'IN_PROGRESS') return 'yellow'
  return 'zinc'
}

export function ProgramListPanel({ programs }: { programs: ProgramItem[] }) {
  const { t } = useI18n()

  const columns: Column<ProgramItem>[] = [
    {
      header: t('software.programs.col.program'),
      className: 'w-[340px]',
      cell: (p) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{p.code} | {p.name}</div>
          <div className="mt-0.5 text-xs text-zinc-600">{t('software.programs.col.owner')}: {p.owner}</div>
        </div>
      ),
    },
    {
      header: t('software.programs.col.status'),
      className: 'w-[120px] text-center',
      cell: (p) => (
        <div className="flex justify-center">
          <Badge tone={statusTone(p.status)}>{p.status}</Badge>
        </div>
      ),
    },
    {
      header: t('software.programs.col.progress'),
      className: 'w-[120px] text-right',
      cell: (p) => (
        <div className="tabular-nums text-zinc-900">
          {p.progressPct}%
        </div>
      ),
    },
    {
      header: t('software.programs.col.baselineEnd'),
      className: 'w-[120px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900">{formatIsoDate(p.baselineEnd)}</div>,
    },
    {
      header: t('software.programs.col.actualEnd'),
      className: 'w-[120px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900">{formatIsoDate(p.actualEnd)}</div>,
    },
    {
      header: t('software.programs.col.delay'),
      className: 'w-[110px] text-right',
      cell: (p) => {
        const d = delayDays(p.baselineEnd, p.actualEnd)
        return (
          <div className={d > 0 ? 'tabular-nums font-semibold text-red-800' : 'tabular-nums text-zinc-900'}>
            {d > 0 ? `+${d}d` : d === 0 ? '0d' : `${d}d`}
          </div>
        )
      },
    },
  ]

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{t('software.programs.title')}</CardTitle>
        <div className="text-xs text-zinc-600">{programs.length}</div>
      </CardHeader>
      <CardBody className="p-0">
        {programs.length > 0 ? (
          <Table columns={columns} rows={programs} rowKey={(p) => p.id} />
        ) : (
          <div className="p-5 text-sm text-zinc-600">{t('software.programs.none')}</div>
        )}
      </CardBody>
    </Card>
  )
}
