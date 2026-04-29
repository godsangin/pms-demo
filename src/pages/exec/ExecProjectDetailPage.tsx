import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { 
  useProjectDetailQuery, 
  useProjectTasksQuery, 
  useProjectDeliverablesQuery, 
  useProjectDefectsQuery 
} from '@/features/project/hooks'
import { useProgramsQuery, useTestScenariosQuery } from '@/features/project/software/hooks'
import { useExecutiveTopBar } from '@/layouts/executive/ExecutiveLayout'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Card, CardBody } from '@/shared/ui/Card'

// Shared Project Layout Wrapper
export function ExecProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId ?? ''
  const { t, lang } = useI18n()
  const { data, isLoading, isError, error } = useProjectDetailQuery(projectId, lang)
  const { setTopBar } = useExecutiveTopBar()

  useEffect(() => {
    const title = data ? data.project.name : `Project ${projectId}`
    const subtitle = data ? data.project.description : ''
    setTopBar({ title, subtitle })
  }, [data, projectId, setTopBar])

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

  return <Outlet context={{ projectDetail: data }} />
}

// 1단계: 프로젝트 관리 (Baseline vs Actual)
import { BaselineActualTimeline } from '@/features/project/components/BaselineActualTimeline'
import { DeliverablesIntakePanel } from '@/features/project/software/components/DeliverablesIntakePanel'
import { StageProgressPanel } from '@/features/project/software/components/StageProgressPanel'

export function ProjectMgmtPage() {
  const { projectId } = useParams()
  const { t, lang } = useI18n()
  const { data: tasks } = useProjectTasksQuery(projectId ?? '', lang)
  const { data: deliverables } = useProjectDeliverablesQuery(projectId ?? '', lang)
  const { data: programs } = useProgramsQuery(projectId ?? '', lang)
  const { data: scenarios } = useTestScenariosQuery(projectId ?? '', lang)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          {deliverables && <DeliverablesIntakePanel items={deliverables} />}
        </div>
        <div className="xl:col-span-4">
          <StageProgressPanel 
            deliverables={deliverables || []}
            programs={(programs as any) || []}
            scenarios={scenarios || []}
          />
        </div>
      </div>
      
      {tasks ? (
        <BaselineActualTimeline tasks={tasks} />
      ) : (
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">{t('app.loading')}</div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

// 2단계: 분석/설계 (산출물 목록 및 진척률)
import { DeliverablesTable } from '@/features/project/components/DeliverablesTable'

export function ProjectAnalysisPage() {
  const { projectId } = useParams()
  const { lang } = useI18n()
  const { data } = useProjectDeliverablesQuery(projectId ?? '', lang)

  const analysisItems = data?.filter(d => d.stage === 'ANALYSIS_DESIGN') || []
  const total = analysisItems.length
  const sumProgress = analysisItems.reduce((acc, curr) => acc + (curr.progressPct || 0), 0)
  const progress = total > 0 ? Math.round(sumProgress / total) : 0

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 text-white border-none shadow-lg">
        <CardBody className="flex items-center justify-between py-6">
          <div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">분석/설계 단계 산출물 진척현황</div>
            <div className="mt-1 text-2xl font-black tabular-nums">Average Progress: {progress}%</div>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase">Total Items</div>
              <div className="text-lg font-bold">{total} 건</div>
            </div>
            <div className="h-10 w-[1px] bg-zinc-800" />
            <div className="w-32 bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </CardBody>
      </Card>
      <DeliverablesTable items={analysisItems} />
    </div>
  )
}

// 3단계: 개발 (개발현황/단위테스트)
import { ProgramListPanel } from '@/features/project/software/components/ProgramListPanel'
import { UnitTestMonitor } from '@/features/project/software/components/UnitTestMonitor'

export function ProjectDevPage() {
  const { projectId } = useParams()
  const { t, lang } = useI18n()
  const programsQuery = useProgramsQuery(projectId ?? '', lang)
  const tasksQuery = useProjectTasksQuery(projectId ?? '', lang)
  const defectsQuery = useProjectDefectsQuery(projectId ?? '')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-6">
          {programsQuery.data ? (
            <ProgramListPanel programs={programsQuery.data as any} />
          ) : (
            <Card><CardBody><div className="text-sm text-zinc-600">{t('app.loading')}</div></CardBody></Card>
          )}
        </div>
        <div className="xl:col-span-6">
          <UnitTestMonitor 
            programs={tasksQuery.data?.filter(t => t.category === 'PROGRAM') || []}
            defects={defectsQuery.data || []}
          />
        </div>
      </div>
    </div>
  )
}

// 4단계: 테스트 (테스트 관리)
import { TestManagementPanel } from '@/features/project/software/components/TestManagementPanel'

export function ProjectTestPage() {
  const { projectId } = useParams()
  const { t, lang } = useI18n()
  const programsQuery = useProgramsQuery(projectId ?? '', lang)
  const testScenariosQuery = useTestScenariosQuery(projectId ?? '', lang)

  return (
    <div className="space-y-4">
      {testScenariosQuery.data ? (
        <TestManagementPanel 
          projectId={projectId ?? ''} 
          programs={(programsQuery.data as any) || []} 
          scenarios={testScenariosQuery.data} 
        />
      ) : (
        <Card><CardBody><div className="text-sm text-zinc-600">{t('app.loading')}</div></CardBody></Card>
      )}
    </div>
  )
}

// 5단계: 이행 (이행안정화)
export function ProjectTransitionPage() {
  const { projectId } = useParams()
  const { lang } = useI18n()
  const { data } = useProjectDeliverablesQuery(projectId ?? '', lang)

  const transitionItems = data?.filter(d => d.stage === 'DEPLOYMENT') || []
  const total = transitionItems.length
  const sumProgress = transitionItems.reduce((acc, curr) => acc + (curr.progressPct || 0), 0)
  const progress = total > 0 ? Math.round(sumProgress / total) : 0

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900 text-white border-none shadow-lg">
        <CardBody className="flex items-center justify-between py-6">
          <div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider">이행 및 안정화 산출물 진척현황</div>
            <div className="mt-1 text-2xl font-black tabular-nums">Average Progress: {progress}%</div>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase">Total Items</div>
              <div className="text-lg font-bold">{total} 건</div>
            </div>
            <div className="h-10 w-[1px] bg-zinc-800" />
            <div className="w-32 bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </CardBody>
      </Card>

      <DeliverablesTable items={transitionItems} />
    </div>
  )
}
