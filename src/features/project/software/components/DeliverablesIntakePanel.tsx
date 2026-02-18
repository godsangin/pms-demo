import type { DeliverableItem, DeliveryStage, DeliverableStatus } from '@/shared/types/pms'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { I18nKey } from '@/shared/i18n/dict'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Table, type Column } from '@/shared/ui/Table'
import { formatIsoDate } from '@/shared/lib/format'

function orderedStages(): DeliveryStage[] {
  return ['ANALYSIS_DESIGN', 'DEVELOPMENT', 'TEST', 'DEPLOYMENT']
}

function stageLabelKey(stage: DeliveryStage): I18nKey {
  if (stage === 'ANALYSIS_DESIGN') return 'software.stage.analysisDesign'
  if (stage === 'DEVELOPMENT') return 'software.stage.development'
  if (stage === 'TEST') return 'software.stage.test'
  return 'software.stage.deployment'
}

function statusTone(status: DeliverableStatus) {
  if (status === 'ACCEPTED') return 'green'
  if (status === 'REJECTED') return 'red'
  if (status === 'SUBMITTED') return 'yellow'
  return 'zinc'
}

export function DeliverablesIntakePanel({ items }: { items: DeliverableItem[] }) {
  const { t } = useI18n()
  const stageItems = items.filter((d) => Boolean(d.stage))

  const summary = orderedStages().map((stage) => {
    const list = stageItems.filter((d) => d.stage === stage)
    const total = list.length
    const received = list.filter((d) => d.status !== 'PLANNED').length
    const accepted = list.filter((d) => d.status === 'ACCEPTED').length
    const rejected = list.filter((d) => d.status === 'REJECTED').length
    const submitted = list.filter((d) => d.status === 'SUBMITTED').length
    return { stage, total, received, accepted, rejected, submitted }
  })

  const columns: Column<DeliverableItem>[] = [
    {
      header: t('deliverables.col.deliverable'),
      className: 'w-[380px]',
      cell: (d) => (
        <div className="leading-tight">
          <div className="font-semibold text-zinc-900">{d.title}</div>
          <div className="mt-0.5 text-xs text-zinc-600">{d.id}</div>
        </div>
      ),
    },
    {
      header: t('software.deliverables.col.stage'),
      className: 'w-[160px]',
      cell: (d) => <div className="text-zinc-900">{d.stage ? t(stageLabelKey(d.stage)) : '-'}</div>,
    },
    {
      header: t('deliverables.col.status'),
      className: 'w-[120px] text-center',
      cell: (d) => (
        <div className="flex justify-center">
          <Badge tone={statusTone(d.status)}>{d.status}</Badge>
        </div>
      ),
    },
    {
      header: t('deliverables.col.due'),
      className: 'w-[120px] text-right',
      cell: (d) => <div className="tabular-nums text-zinc-900">{formatIsoDate(d.dueDate)}</div>,
    },
    {
      header: t('deliverables.col.submitted'),
      className: 'w-[120px] text-right',
      cell: (d) => <div className="tabular-nums text-zinc-900">{d.submittedDate ? formatIsoDate(d.submittedDate) : '-'}</div>,
    },
    {
      header: t('deliverables.col.decided'),
      className: 'w-[120px] text-right',
      cell: (d) => <div className="tabular-nums text-zinc-900">{d.decidedDate ? formatIsoDate(d.decidedDate) : '-'}</div>,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('software.deliverables.title')}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((s) => (
            <div key={s.stage} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="text-xs font-semibold text-zinc-900">{t(stageLabelKey(s.stage))}</div>
              <div className="mt-1 text-xs text-zinc-600 tabular-nums">
                {t('software.deliverables.received')}: <span className="font-semibold text-zinc-900">{s.received}</span>/{s.total}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge tone="green">ACCEPTED {s.accepted}</Badge>
                <Badge tone="yellow">SUBMITTED {s.submitted}</Badge>
                <Badge tone="red">REJECTED {s.rejected}</Badge>
              </div>
            </div>
          ))}
        </div>

        {stageItems.length > 0 ? (
          <Table columns={columns} rows={stageItems} rowKey={(d) => d.id} />
        ) : (
          <div className="text-sm text-zinc-600">{t('deliverables.none')}</div>
        )}
      </CardBody>
    </Card>
  )
}
