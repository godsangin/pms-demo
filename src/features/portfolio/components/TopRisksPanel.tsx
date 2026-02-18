import { Link } from 'react-router-dom'

import { formatDday, formatIsoDate } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { ProjectListItem, RiskItem } from '@/shared/types/pms'
import { Badge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'

function severityTone(sev: RiskItem['severity']) {
  return sev === 'CRITICAL' ? 'red' : 'yellow'
}

export function TopRisksPanel({
  risks,
  projects,
}: {
  risks: RiskItem[]
  projects: ProjectListItem[]
}) {
  const { t } = useI18n()
  const projectNameById = new Map(projects.map((p) => [p.id, p.name] as const))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.topRisks.title')}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {risks.map((r) => (
          <div key={r.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-zinc-900">
                {projectNameById.get(r.projectId) ?? r.projectId}
              </div>
              <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
            </div>
            <div className="mt-2 text-xs text-zinc-700">
              <span className="font-semibold text-zinc-900">{t('dashboard.topRisks.cause')}:</span> {r.cause}
            </div>
            <div className="mt-1 text-xs text-zinc-700">
              <span className="font-semibold text-zinc-900">{t('dashboard.topRisks.action')}:</span> {r.action}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-xs">
              <div className="text-zinc-600">
                {t('dashboard.topRisks.target')}: {formatIsoDate(r.targetDate)} | {formatDday(r.targetDate)}
              </div>
              <Link
                to={`/exec/projects/${r.projectId}`}
                className="font-semibold text-zinc-900 hover:underline"
              >
                {t('dashboard.topRisks.view')}
              </Link>
            </div>
          </div>
        ))}

        {risks.length === 0 ? <div className="text-sm text-zinc-600">{t('dashboard.topRisks.none')}</div> : null}
      </CardBody>
    </Card>
  )
}
