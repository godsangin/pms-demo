import { formatDday, formatIsoDate } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { RiskItem } from '@/shared/types/pms'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'

function severityTone(sev: RiskItem['severity']) {
  return sev === 'CRITICAL' ? 'red' : 'yellow'
}

export function TopRisksBlock({ risks }: { risks: RiskItem[] }) {
  const { t } = useI18n()

  const items = [...risks]
    .sort((a, b) => {
      const rank = (s: RiskItem['severity']) => (s === 'CRITICAL' ? 2 : 1)
      const bySev = rank(b.severity) - rank(a.severity)
      if (bySev !== 0) return bySev
      return a.targetDate.localeCompare(b.targetDate)
    })
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.topRisks.title')}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-2xl border border-zinc-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-zinc-900">{r.id}</div>
              <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
            </div>
            <div className="mt-2 text-xs text-zinc-700">
              <span className="font-semibold text-zinc-900">{t('project.topRisks.cause')}:</span> {r.cause}
            </div>
            <div className="mt-1 text-xs text-zinc-700">
              <span className="font-semibold text-zinc-900">{t('project.topRisks.action')}:</span> {r.action}
            </div>
            <div className="mt-1 text-xs text-zinc-700">
              <span className="font-semibold text-zinc-900">{t('project.topRisks.impact')}:</span> {r.expectedImpact}
            </div>
            <div className="mt-2 text-xs text-zinc-600">
              {t('dashboard.topRisks.target')}: {formatIsoDate(r.targetDate)} | {formatDday(r.targetDate)}
            </div>
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-zinc-600">{t('project.topRisks.none')}</div> : null}
      </CardBody>
    </Card>
  )
}
