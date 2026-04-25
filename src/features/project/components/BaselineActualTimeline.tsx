import { useState, useMemo } from 'react'
import { formatIsoDate, formatPercent } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import type { ProjectTask } from '@/shared/types/pms'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { calculateWbsProgress } from '@/shared/lib/wbs'
import { cn } from '@/shared/lib/cn'

function parseIsoDateLocal(iso: string | undefined | null) {
  if (!iso) return null
  const [y, m, d] = iso.slice(0, 10).split('-').map((v) => Number(v))
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function dayDiff(aIso: string | undefined | null, bIso: string | undefined | null) {
  const a = parseIsoDateLocal(aIso)
  const b = parseIsoDateLocal(bIso)
  if (!a || !b) return 0
  return Math.round((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000))
}

export function BaselineActualTimeline({ tasks }: { tasks: ProjectTask[] }) {
  const { t } = useI18n()
  const [showAll, setShowAll] = useState(false)

  // WBS 트리 구조 정렬 및 계산 적용
  const processedTasks = useMemo(() => {
    return calculateWbsProgress(tasks)
  }, [tasks])

  const dates = processedTasks
    .flatMap((x) => [x.baselineStart, x.baselineEnd, x.actualStart, x.actualEnd])
    .filter((d): d is string => !!d)
  
  const minDate = dates.length > 0 ? dates.reduce((min, d) => (d < min ? d : min), dates[0]) : '2026-01-01'
  const maxDate = dates.length > 0 ? dates.reduce((max, d) => (d > max ? d : max), dates[0]) : '2026-12-31'
  
  const start = parseIsoDateLocal(minDate)!
  const end = parseIsoDateLocal(maxDate)!
  const span = Math.max(1, end.getTime() - start.getTime())

  const pos = (iso: string | undefined | null) => {
    const d = parseIsoDateLocal(iso)
    if (!d) return null
    return (d.getTime() - start.getTime()) / span
  }

  const displayedTasks = showAll ? processedTasks : processedTasks.slice(0, 15)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <CardTitle>{t('project.timeline.title')}</CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-600">
              {formatIsoDate(minDate)} - {formatIsoDate(maxDate)}
            </div>
            {processedTasks.length > 15 && (
              <Button size="sm" variant="outline" onClick={() => setShowAll(!showAll)}>
                {showAll ? '접기' : `전체 보기 (${processedTasks.length})`}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          <div className="w-[280px]">{t('project.timeline.task')}</div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span>{formatIsoDate(minDate)}</span>
              <span>{formatIsoDate(maxDate)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {displayedTasks.map((task) => {
            const bLeft = pos(task.baselineStart)
            const bRight = pos(task.baselineEnd)
            const aLeft = pos(task.actualStart)
            const aRight = pos(task.actualEnd)

            const lateDays = dayDiff(task.actualEnd, task.baselineEnd)
            const isRoot = (task.depth ?? 0) === 0
            const isParent = (task.depth ?? 0) < 2

            return (
              <div 
                key={task.id} 
                className={cn(
                  "group rounded-xl border border-transparent hover:border-zinc-200 hover:bg-zinc-50/50 transition-colors",
                  isRoot ? "bg-zinc-100/50 border-zinc-200" : ""
                )}
                style={{ marginLeft: `${(task.depth ?? 0) * 12}px` }}
              >
                <div className="flex items-center gap-3 p-2">
                  <div className="w-[280px] flex-shrink-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-mono text-zinc-400 w-16 truncate">{task.wbsCode}</span>
                      <span className={cn(
                        "text-sm truncate",
                        isRoot ? "font-bold text-zinc-900" : isParent ? "font-semibold text-zinc-800" : "text-zinc-700"
                      )}>
                        {task.name}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <div className="h-1 w-16 bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-zinc-600" 
                          style={{ width: `${task.progressPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-500">{formatPercent(task.progressPct, 1)}</span>
                      {(task.weight ?? 0) > 0 && (
                        <span className="text-[10px] text-zinc-400">({formatPercent((task.weight ?? 0) * 100, 1)})</span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 relative h-8 flex flex-col justify-center">
                    {/* Baseline Bar */}
                    <div className="relative h-1.5 rounded-full bg-zinc-100 mb-1">
                      {bLeft !== null && bRight !== null && (
                        <div
                          className="absolute h-full rounded-full bg-zinc-300"
                          style={{ left: `${bLeft * 100}%`, width: `${Math.max(0.5, (bRight - bLeft) * 100)}%` }}
                        />
                      )}
                    </div>

                    {/* Actual/Progress Bar */}
                    <div className="relative h-2 rounded-full bg-zinc-100">
                      {aLeft !== null && aRight !== null && (
                        <div
                          className={cn(
                            "absolute h-full rounded-full",
                            lateDays > 7 ? "bg-red-500" : lateDays > 0 ? "bg-yellow-500" : "bg-zinc-900"
                          )}
                          style={{ left: `${aLeft * 100}%`, width: `${Math.max(0.5, (aRight - aLeft) * 100)}%` }}
                        />
                      )}
                    </div>

                    {/* Delay indicator */}
                    {lateDays > 0 && (
                      <div 
                        className="absolute -top-1 text-[9px] font-bold text-red-600"
                        style={{ left: `${(aRight || 0) * 100}%` }}
                      >
                        +{lateDays}d
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {processedTasks.length === 0 ? <div className="text-sm text-zinc-600">{t('project.timeline.none')}</div> : null}
      </CardBody>
    </Card>
  )
}
