import { useEffect, useState } from 'react'

import { KpiGrid } from '@/features/portfolio/components/KpiGrid'
import { ProjectsTable } from '@/features/portfolio/components/ProjectsTable'
import { TopRisksPanel } from '@/features/portfolio/components/TopRisksPanel'
import { usePortfolioDashboardQuery } from '@/features/portfolio/hooks'
import { ProjectForm } from '@/features/project/components/ProjectForm'
import { useExecutiveTopBar } from '@/layouts/executive/ExecutiveLayout'
import { formatIsoDate } from '@/shared/lib/format'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Drawer } from '@/shared/ui/Drawer'

export function ExecDashboardPage() {
  const { setTopBar } = useExecutiveTopBar()
  const { t, lang } = useI18n()
  const { data, isLoading, isError, error } = usePortfolioDashboardQuery(lang)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  useEffect(() => {
    const base = t('dashboard.topbar.subtitle')
    const subtitle = data ? `${base} | ${t('dashboard.topbar.asOf', { date: formatIsoDate(data.asOfDate) })}` : base
    setTopBar({
      title: t('dashboard.topbar.title'),
      subtitle,
    })
  }, [data, setTopBar, t])

  const handleSaveProject = (formData: any) => {
    console.log('New Project Data:', formData)
    alert('신규 프로젝트가 등록되었습니다 (Mock)')
    setIsProjectModalOpen(false)
  }

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

  return (
    <div className="space-y-4">
      {data ? <KpiGrid kpis={data.kpis} /> : isLoading ? <div className="h-[96px]" /> : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
            <Card>
              <CardHeader className="flex items-center justify-between">
              <CardTitle>{t('dashboard.heatmap.title')}</CardTitle>
              <div className="flex items-center gap-4">
                {data ? (
                  <div className="text-xs text-zinc-600">
                    {t('dashboard.heatmap.projectsCount', { count: data.projects.length })}
                  </div>
                ) : null}
                <Button size="sm" onClick={() => setIsProjectModalOpen(true)}>
                  + 프로젝트 등록
                </Button>
              </div>
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

      <Drawer 
        open={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)}
        title="신규 프로젝트 등록"
      >
        <div className="p-4">
          <ProjectForm 
            onSave={handleSaveProject} 
            onCancel={() => setIsProjectModalOpen(false)} 
          />
        </div>
      </Drawer>
    </div>
  )
}
