import { formatPercent, formatSignedPercent } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Card, CardBody } from '@/shared/ui/Card'
import type { PortfolioKpis } from '@/shared/types/pms'

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="h-full">
      <CardBody className="px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{value}</div>
      </CardBody>
    </Card>
  )
}

export function KpiGrid({ kpis }: { kpis: PortfolioKpis }) {
  const { t } = useI18n()

  if (!kpis) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <KpiCard
        label={t('dashboard.kpi.projectsInProgress')}
        value={`${kpis.totalProjects || 0} / ${kpis.inProgressProjects || 0}`}
      />
      <KpiCard label={t('dashboard.kpi.onTrackPct')} value={formatPercent(kpis.onTrackPercent || 0, 0)} />
      <KpiCard label={t('dashboard.kpi.atRiskProjects')} value={String(kpis.atRiskProjects || 0)} />
      <KpiCard label={t('dashboard.kpi.criticalTasks')} value={String(kpis.criticalTasks || 0)} />
      <KpiCard
        label={t('dashboard.kpi.approval')}
        value={formatPercent(kpis.deliverableApprovalRate || 0, 0)}
      />
      <KpiCard label={t('dashboard.kpi.portfolioSvAvg')} value={formatSignedPercent(kpis.portfolioSvAvg || 0, 1)} />
    </div>
  )
}
