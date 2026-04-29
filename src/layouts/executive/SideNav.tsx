import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, AlertCircle } from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { useProjectDetailQuery } from '@/features/project/hooks'
import { useRisksBoardQuery } from '@/features/risk/hooks'
import { formatPercent } from '@/shared/lib/format'

export function SideNav() {
  const { t, lang } = useI18n()
  const location = useLocation()
  
  // Extract projectId from URL if present
  const projectPathMatch = location.pathname.match(/\/exec\/projects\/([^/]+)/)
  const projectIdFromUrl = projectPathMatch ? projectPathMatch[1] : null
  
  // Default project for demo if needed, but we prioritize URL param
  const activeProjectId = projectIdFromUrl || 'P-2026'
  const isProjectPage = !!projectIdFromUrl

  const { data: projectDetail } = useProjectDetailQuery(activeProjectId, lang)
  const { data: risksBoard } = useRisksBoardQuery(lang)

  const riskCount = risksBoard?.items.length || 0
  const issueCount = projectDetail?.risks.filter(r => r.status === 'OPEN').length || 0

  const phases = projectDetail?.phases || []

  // Phase sub-items mapping to new routes
  const phaseRoutes = [
    { name: '프로젝트 관리', path: 'mgmt' },
    { name: '분석/설계', path: 'analysis' },
    { name: '개발', path: 'dev' },
    { name: '테스트', path: 'test' },
    { name: '이행', path: 'transition' },
  ]

  return (
    <div className="flex h-full flex-col bg-zinc-50/50">
      <div className="border-b border-zinc-200 px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <span className="text-sm font-bold">P</span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t('nav.product')}</div>
            <div className="text-sm font-bold tracking-tight text-zinc-900">
              {t('nav.execDemo')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <NavLink
            to="/exec"
            end
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                isActive 
                  ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{t('nav.exec.dashboard') || '대시보드'}</span>
          </NavLink>

          {isProjectPage && (
            <div className="pt-2">
              <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-zinc-900">
                <Briefcase className="h-4 w-4" />
                <span>{t('nav.exec.projectManage') || '프로젝트 관리'}</span>
              </div>
              
              <div className="mt-1 space-y-1 pl-9 pr-2">
                {phaseRoutes.map((route, idx) => {
                  const phaseData = phases.find(p => p.name.includes(route.name.split('/')[0]))
                  const progress = phaseData ? formatPercent(phaseData.progressRate, 0) : '0%'
                  
                  return (
                    <NavLink
                      key={route.path}
                      to={`/exec/projects/${activeProjectId}/${route.path}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between py-1.5 text-[13px] transition-colors',
                          isActive ? 'font-bold text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
                        )
                      }
                    >
                      <span>{idx + 1}. {route.name}</span>
                      <span className="font-medium">{progress}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )}

          <div className="pt-2">
            <NavLink
              to="/exec/risks"
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                  isActive 
                    ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200' 
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
                )
              }
            >
              <AlertCircle className="h-4 w-4" />
              <div className="flex flex-1 items-center justify-between">
                <span>{t('nav.exec.riskBoard') || '이슈/리스크보드'}</span>
              </div>
            </NavLink>
            <div className="mt-1 pl-9 text-[13px] text-zinc-500">
              이슈 <span className="font-medium text-zinc-900">{issueCount}</span>건, 
              리스크 <span className="font-medium text-zinc-900">{riskCount}</span>건
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 p-4">
        <div className="rounded-xl bg-zinc-100 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t('nav.footer.mockOnly')}</div>
          <div className="mt-1 text-[11px] text-zinc-600 leading-relaxed">
            데모 시스템은 실시간 데이터와 연동되지 않는 Mock 기반으로 동작합니다.
          </div>
        </div>
      </div>
    </div>
  )
}
