import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { BaselineActualTimeline } from '@/features/project/components/BaselineActualTimeline'
import { DeliverablesTable } from '@/features/project/components/DeliverablesTable'
import { ProgressTrendChart } from '@/features/project/components/ProgressTrendChart'
import { TopRisksBlock } from '@/features/project/components/TopRisksBlock'
import { DeliverablesIntakePanel } from '@/features/project/software/components/DeliverablesIntakePanel'
import { ProgramListPanel } from '@/features/project/software/components/ProgramListPanel'
import { StageProgressPanel } from '@/features/project/software/components/StageProgressPanel'
import { TestManagementPanel } from '@/features/project/software/components/TestManagementPanel'
import {
  useProjectDeliverablesQuery,
  useProjectDetailQuery,
  useProjectProgressQuery,
  useProjectTasksQuery,
} from '@/features/project/hooks'
import {
  useProgramsQuery,
  useStageProgressQuery,
  useTestScenariosQuery,
} from '@/features/project/software/hooks'
import { useExecutiveTopBar } from '@/layouts/executive/ExecutiveLayout'
import { formatDday, formatIsoDate, formatPercent, formatSignedPercent } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { StatusBadge } from '@/shared/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'

export function ExecProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId ?? ''

  const { t, lang } = useI18n()

  const { data, isLoading, isError, error } = useProjectDetailQuery(projectId, lang)
  const progressQuery = useProjectProgressQuery(projectId)
  const tasksQuery = useProjectTasksQuery(projectId, lang)
  const deliverablesQuery = useProjectDeliverablesQuery(projectId, lang)
  const stageProgressQuery = useStageProgressQuery(projectId)
  const programsQuery = useProgramsQuery(projectId, lang)
  const testScenariosQuery = useTestScenariosQuery(projectId, lang)
  const { setTopBar } = useExecutiveTopBar()

  useEffect(() => {
    const title = data ? data.project.name : `Project ${projectId}`
    const subtitle = data ? data.project.description : ''
    setTopBar({ title, subtitle })
  }, [data, projectId, setTopBar])

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
          <div className="text-sm font-semibold text-zinc-900">{t('project.error.title')}</div>
          <div className="mt-1 text-sm text-zinc-600">{message}</div>
        </CardBody>
      </Card>
    )
  }

  if (!data && isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-sm text-zinc-600">{t('app.loading')}</div>
        </CardBody>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardBody>
          <div className="text-sm text-zinc-600">{t('project.notFound')}</div>
        </CardBody>
      </Card>
    )
  }

  const p = data.project
  const isSoftwareBuild = p.id === 'P-1098' || p.id === 'P-2026'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-600">
            <Link to="/exec" className="font-semibold text-zinc-900 hover:underline">
              {t('project.breadcrumb.portfolio')}
            </Link>{' '}
            / <span className="font-semibold text-zinc-900">{p.id}</span>
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{p.name}</div>
          <div className="mt-1 text-sm text-zinc-600">{p.description}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('project.section.overview')}</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900">{t('project.field.status')}</div>
                <StatusBadge status={p.status} />
              </div>
              <div className="rounded-2xl border border-zinc-200 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.period')}</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900">
                      {formatIsoDate(p.startDate)} - {formatIsoDate(p.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.pm')}</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900">{p.pmName}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.nextMilestone')}</div>
                <div className="mt-1 text-sm font-semibold text-zinc-900">{p.nextMilestone.name}</div>
                <div className="mt-0.5 text-xs text-zinc-600">
                  {formatIsoDate(p.nextMilestone.date)} | {formatDday(p.nextMilestone.date)}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('project.section.performance')}</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="rounded-2xl border border-zinc-200 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.svThisWeek')}</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                  {formatSignedPercent(p.svThisWeek, 1)}
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                  {svTrend
                    ? `${t('project.field.twoWeekTrend')}: ${svTrend.prevWeek} ${formatSignedPercent(svTrend.prev, 1)} -> ${svTrend.currWeek} ${formatSignedPercent(svTrend.curr, 1)}`
                    : `${t('project.field.twoWeekTrend')}: -`}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-zinc-200 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{t('project.field.deliverableApproval')}</div>
                  <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">
                    {formatPercent(p.deliverableApprovalRate, 0)}
                  </div>
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
          <TopRisksBlock risks={data.risks} />
        </div>
      </div>

      {progressQuery.data ? (
        <ProgressTrendChart points={progressQuery.data} />
      ) : (
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">{t('app.loadingChart')}</div>
          </CardBody>
        </Card>
      )}

      {tasksQuery.data ? (
        <BaselineActualTimeline tasks={tasksQuery.data} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('project.timeline.title')}</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="text-sm text-zinc-600">{t('app.loading')}</div>
          </CardBody>
        </Card>
      )}

      {isSoftwareBuild && deliverablesQuery.data ? <DeliverablesIntakePanel items={deliverablesQuery.data} /> : null}

      {isSoftwareBuild ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-6">
            {stageProgressQuery.data ? (
              <StageProgressPanel 
                stages={stageProgressQuery.data} 
                deliverables={deliverablesQuery.data}
                programs={programsQuery.data}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{t('software.stageProgress.title')}</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="text-sm text-zinc-600">{t('app.loading')}</div>
                </CardBody>
              </Card>
            )}
          </div>
          <div className="xl:col-span-6">
            {programsQuery.data ? (
              <ProgramListPanel programs={programsQuery.data} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{t('software.programs.title')}</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="text-sm text-zinc-600">{t('app.loading')}</div>
                </CardBody>
              </Card>
            )}
          </div>
          <div className="xl:col-span-12">
            {programsQuery.data && testScenariosQuery.data ? (
              <TestManagementPanel projectId={p.id} programs={programsQuery.data} scenarios={testScenariosQuery.data} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{t('software.tests.title')}</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="text-sm text-zinc-600">{t('app.loading')}</div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      ) : null}

      {!isSoftwareBuild && deliverablesQuery.data ? <DeliverablesTable items={deliverablesQuery.data} /> : null}

      {!isSoftwareBuild && !deliverablesQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('deliverables.title')}</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="text-sm text-zinc-600">{t('app.loading')}</div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  )
}
