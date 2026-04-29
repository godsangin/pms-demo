import { useEffect, useMemo } from 'react'

import { KpiGrid } from '@/features/portfolio/components/KpiGrid'
import { ProjectsTable } from '@/features/portfolio/components/ProjectsTable'
import { TopRisksPanel } from '@/features/portfolio/components/TopRisksPanel'
import { usePortfolioDashboardQuery } from '@/features/portfolio/hooks'
import { useExecutiveTopBar } from '@/layouts/executive/ExecutiveLayout'
import { formatDday, formatIsoDate, formatPercent, formatSignedPercent } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { StatusBadge } from '@/shared/ui/Badge'
import { ProgressTrendChart } from '@/features/project/components/ProgressTrendChart'
import { useProjectDetailQuery, useProjectProgressQuery } from '@/features/project/hooks'

export function ExecDashboardPage() {
  const { setTopBar } = useExecutiveTopBar()
  const { t, lang } = useI18n()
  const { data, isLoading, isError, error } = usePortfolioDashboardQuery(lang)
  
  // Fixed demo project ID
  const projectId = 'P-2026'
  const projectDetailQuery = useProjectDetailQuery(projectId, lang)
  const progressQuery = useProjectProgressQuery(projectId)

  useEffect(() => {
    const base = t('dashboard.topbar.subtitle')
    const subtitle = data ? `${base} | ${t('dashboard.topbar.asOf', { date: formatIsoDate(data.asOfDate) })}` : base
    setTopBar({
      title: t('dashboard.topbar.title'),
      subtitle,
    })
  }, [data, setTopBar, t])

  const svTrend = useMemo(() => {
    const points = progressQuery.data
    if (!points || points.length < 2) return undefined
    const last2 = points.slice(-2)
    const sv = last2.map((p) => p.actual - p.planned)
    return { prev: sv[0], curr: sv[1], prevWeek: last2[0].week, currWeek: last2[1].week }
  }, [progressQuery.data])

  if (isError) {
    const message = error instanceof Error ? error.message : t('app.unknownError')
    return (
      <Card>
        <CardBody>
          <div className="text-sm font-semibold text-zinc-900">{t('dashboard.error.title')}</div>
          <div className="mt-1 text-sm text-zinc-600">{message}</div>
        </CardBody>
      </Card>
    )
  }

  const p = projectDetailQuery.data?.project

  return (
    <div className="space-y-4">
      {data ? <KpiGrid kpis={data.kpis} /> : isLoading ? <div className="h-[96px]" /> : null}

      {/* Project Summary & Performance (Added to Dashboard) */}
      {p && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <Card>
              <CardHeader><CardTitle>{t('project.section.overview')}</CardTitle></CardHeader>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900">{t('project.field.status')}</div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="rounded-2xl border border-zinc-200 p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-zinc-900">
                    <div>{formatIsoDate(p.startDate)} - {formatIsoDate(p.endDate)}</div>
                    <div className="text-right">{p.pmName}</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.nextMilestone')}</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">{p.nextMilestone.name}</div>
                  <div className="mt-0.5 text-xs text-zinc-600">{formatIsoDate(p.nextMilestone.date)} | {formatDday(p.nextMilestone.date)}</div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="xl:col-span-4">
            <Card>
              <CardHeader><CardTitle>{t('project.section.performance')}</CardTitle></CardHeader>
              <CardBody className="space-y-3">
                <div className="rounded-2xl border border-zinc-200 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.svThisWeek')}</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{formatSignedPercent(p.svThisWeek, 1)}</div>
                  <div className="mt-1 text-xs text-zinc-600">
                    {svTrend ? `${svTrend.prevWeek} ${formatSignedPercent(svTrend.prev, 1)} -> ${svTrend.currWeek} ${formatSignedPercent(svTrend.curr, 1)}` : '-'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-zinc-200 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.deliverableApproval')}</div>
                    <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">{formatPercent(p.deliverableApprovalRate, 0)}</div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.highRisks')}</div>
                    <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">{p.highRiskCount}</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="xl:col-span-4">
            {/* StageProgressPanel was here, moved to ProjectMgmtPage */}
            <Card className="h-full border-zinc-200/60 shadow-sm bg-zinc-50/50">
              <CardBody className="flex items-center justify-center h-full text-zinc-400 text-sm">
                {t('project.section.overview')} - {p.name}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Progress Trend Chart (Added to Dashboard) */}
      {progressQuery.data && (
        <ProgressTrendChart points={progressQuery.data} />
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
            <Card>
              <CardHeader className="flex items-center justify-between">
              <CardTitle>{t('dashboard.heatmap.title')}</CardTitle>
              {data?.projects ? (
                <div className="text-xs text-zinc-600">
                  {t('dashboard.heatmap.projectsCount', { count: data.projects.length })}
                </div>
              ) : null}
            </CardHeader>
            <CardBody className="p-0">
              {data ? (
                <ProjectsTable projects={data.projects} />
              ) : (
                <div className="p-5 text-sm text-zinc-600">{t('app.loading')}</div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-4">
          {data ? (
            <TopRisksPanel risks={data.topRisks} projects={data.projects} />
          ) : (
            <Card>
              <CardBody>
                <div className="text-sm text-zinc-600">{t('app.loading')}</div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
