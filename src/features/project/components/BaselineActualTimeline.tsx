import { formatIsoDate } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { ProjectTask } from '@/shared/types/pms'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'

function parseIsoDateLocal(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map((v) => Number(v))
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function dayDiff(aIso: string, bIso: string) {
  const a = parseIsoDateLocal(aIso)
  const b = parseIsoDateLocal(bIso)
  return Math.round((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000))
}

export function BaselineActualTimeline({ tasks }: { tasks: ProjectTask[] }) {
  const { t } = useI18n()

  const dates = tasks.flatMap((x) => [x.baselineStart, x.baselineEnd, x.actualStart, x.actualEnd])
  const start = parseIsoDateLocal(dates.reduce((min, d) => (d < min ? d : min), dates[0] ?? '2026-01-01'))
  const end = parseIsoDateLocal(dates.reduce((max, d) => (d > max ? d : max), dates[0] ?? '2026-01-01'))
  const span = Math.max(1, end.getTime() - start.getTime())

  const pos = (iso: string) => {
    const d = parseIsoDateLocal(iso)
    return (d.getTime() - start.getTime()) / span
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <CardTitle>{t('project.timeline.title')}</CardTitle>
          <div className="text-xs text-zinc-600">
            {formatIsoDate(dates.reduce((min, d) => (d < min ? d : min), dates[0] ?? '2026-01-01'))} -{' '}
            {formatIsoDate(dates.reduce((max, d) => (d > max ? d : max), dates[0] ?? '2026-01-01'))}
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          <div className="w-[220px]">{t('project.timeline.task')}</div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span>{formatIsoDate(dates.reduce((min, d) => (d < min ? d : min), dates[0] ?? '2026-01-01'))}</span>
              <span>{formatIsoDate(dates.reduce((max, d) => (d > max ? d : max), dates[0] ?? '2026-01-01'))}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => {
            const bLeft = pos(task.baselineStart)
            const bRight = pos(task.baselineEnd)
            const aLeft = pos(task.actualStart)
            const aRight = pos(task.actualEnd)

            const lateDays = dayDiff(task.actualEnd, task.baselineEnd)

            return (
              <div key={task.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="flex items-start gap-3">
                  <div className="w-[220px]">
                    <div className="text-sm font-semibold text-zinc-900">{task.name}</div>
                    <div className="mt-1 text-xs text-zinc-600">{task.id}</div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="relative h-4 rounded-xl bg-zinc-100">
                      <div
                        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-zinc-300"
                        style={{ left: `${bLeft * 100}%`, width: `${Math.max(1, (bRight - bLeft) * 100)}%` }}
                        title={`${t('project.timeline.baseline')}: ${formatIsoDate(task.baselineStart)} - ${formatIsoDate(task.baselineEnd)}`}
                      />
                    </div>

                    <div className="mt-2 relative h-4 rounded-xl bg-zinc-100">
                      <div
                        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-zinc-900"
                        style={{ left: `${aLeft * 100}%`, width: `${Math.max(1, (aRight - aLeft) * 100)}%` }}
                        title={`${t('project.timeline.actual')}: ${formatIsoDate(task.actualStart)} - ${formatIsoDate(task.actualEnd)}`}
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-zinc-600">
                        {t('project.timeline.baseline')}: {formatIsoDate(task.baselineStart)} - {formatIsoDate(task.baselineEnd)}
                      </div>
                      <div className="text-zinc-600">
                        {t('project.timeline.actual')}: {formatIsoDate(task.actualStart)} - {formatIsoDate(task.actualEnd)}
                      </div>
                      {lateDays > 0 ? (
                        <div className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-800 ring-1 ring-inset ring-red-200">
                          {t('project.timeline.late', { days: lateDays })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {tasks.length === 0 ? <div className="text-sm text-zinc-600">{t('project.timeline.none')}</div> : null}
      </CardBody>
    </Card>
  )
}
