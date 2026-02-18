import { Link } from 'react-router-dom'

import { formatDday, formatPercent, formatSignedPercent, formatIsoDate } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { ProjectListItem } from '@/shared/types/pms'
import { StatusBadge } from '@/shared/ui/Badge'
import { Table, type Column } from '@/shared/ui/Table'

export function ProjectsTable({ projects }: { projects: ProjectListItem[] }) {
  const { t } = useI18n()

  const columns: Column<ProjectListItem>[] = [
    {
      header: t('table.project'),
      className: 'w-[310px]',
      cell: (p) => (
        <div className="leading-tight">
          <Link
            className="font-semibold text-zinc-900 hover:underline"
            to={`/exec/projects/${p.id}`}
          >
            {p.name}
          </Link>
          <div className="mt-0.5 text-xs text-zinc-600">{p.id}</div>
        </div>
      ),
    },
    {
      header: t('table.status'),
      className: 'w-[110px] text-center',
      cell: (p) => (
        <div className="flex justify-center">
          <StatusBadge status={p.status} />
        </div>
      ),
    },
    {
      header: t('table.svThisWeek'),
      className: 'w-[120px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900">{formatSignedPercent(p.svThisWeek, 1)}</div>,
    },
    {
      header: t('table.nextMilestone'),
      className: 'w-[240px]',
      cell: (p) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{p.nextMilestone.name}</div>
          <div className="mt-0.5 text-xs text-zinc-600">
            {formatIsoDate(p.nextMilestone.date)} | {formatDday(p.nextMilestone.date)}
          </div>
        </div>
      ),
    },
    {
      header: t('table.highRisk'),
      className: 'w-[90px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900">{p.highRiskCount}</div>,
    },
    {
      header: t('table.approval'),
      className: 'w-[100px] text-right',
      cell: (p) => <div className="tabular-nums text-zinc-900">{formatPercent(p.deliverableApprovalRate, 0)}</div>,
    },
    {
      header: t('table.pm'),
      className: 'w-[120px]',
      cell: (p) => <div className="text-zinc-900">{p.pmName}</div>,
    },
  ]

  return <Table columns={columns} rows={projects} rowKey={(p) => p.id} />
}
