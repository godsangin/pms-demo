import type { DeliveryStage, StageProgress } from '@/shared/types/pms'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { I18nKey } from '@/shared/i18n/dict'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'

function orderedStages(): DeliveryStage[] {
  return ['ANALYSIS_DESIGN', 'DEVELOPMENT', 'TEST', 'DEPLOYMENT']
}

function stageLabelKey(stage: DeliveryStage): I18nKey {
  if (stage === 'ANALYSIS_DESIGN') return 'software.stage.analysisDesign'
  if (stage === 'DEVELOPMENT') return 'software.stage.development'
  if (stage === 'TEST') return 'software.stage.test'
  return 'software.stage.deployment'
}

export function StageProgressPanel({ items }: { items: StageProgress[] }) {
  const { t } = useI18n()
  const byStage = new Map(items.map((x) => [x.stage, x] as const))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('software.stageProgress.title')}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {orderedStages().map((stage) => {
          const it = byStage.get(stage)
          const planned = it?.plannedPct ?? 0
          const actual = it?.actualPct ?? 0
          const delta = actual - planned
          return (
            <div key={stage} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-zinc-900">{t(stageLabelKey(stage))}</div>
                <div className="text-xs font-semibold text-zinc-600 tabular-nums">
                  {t('software.stageProgress.planned')}: {planned}% | {t('software.stageProgress.actual')}: {actual}%
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <div className="relative h-3 rounded-full bg-zinc-100">
                  <div
                    className="absolute left-0 top-0 h-3 rounded-full bg-zinc-300"
                    style={{ width: `${Math.min(100, Math.max(0, planned))}%` }}
                  />
                </div>
                <div className="relative h-3 rounded-full bg-zinc-100">
                  <div
                    className="absolute left-0 top-0 h-3 rounded-full bg-zinc-900"
                    style={{ width: `${Math.min(100, Math.max(0, actual))}%` }}
                  />
                </div>
              </div>

              <div className="mt-2 text-xs">
                <span className="text-zinc-600">Delta:</span>{' '}
                <span className={delta < 0 ? 'font-semibold text-red-800' : 'font-semibold text-zinc-900'}>
                  {delta > 0 ? '+' : ''}
                  {delta}%
                </span>
              </div>
            </div>
          )
        })}

        {items.length === 0 ? <div className="text-sm text-zinc-600">{t('software.stageProgress.none')}</div> : null}
      </CardBody>
    </Card>
  )
}
