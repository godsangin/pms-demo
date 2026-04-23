import { apiClient, isMockMode } from '@/shared/api/client'
import { db } from '@/mocks/db'
import type { LocalizedProject, LocalizedRisk, LocalizedText } from '@/mocks/db/seed/types'
import type { Lang } from '@/shared/i18n/dict'
import { sleep } from '@/shared/lib/sleep'
import type { PortfolioDashboard, PortfolioKpis, ProjectListItem, RiskItem } from '@/shared/types/pms'
import { getCurrentUser } from '@/shared/lib/role'

function mean(values: number[]) {
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return sum / values.length
}

function severityScore(sev: RiskItem['severity']) {
  return sev === 'CRITICAL' ? 2 : 1
}

function pickText(text: LocalizedText, lang: Lang) {
  return lang === 'ko' ? text.ko : text.en
}

function mapProject(p: LocalizedProject, lang: Lang): ProjectListItem {
  // 프로젝트별 단계 데이터를 찾아 가중치 합산 진척률 계산
  const phases = db.phases.filter(phase => phase.projectId === p.id)
  const totalProgress = phases.length > 0 
    ? phases.reduce((sum, phase) => sum + (phase.progressRate * phase.weight / 100), 0)
    : p.totalProgress || 0

  return {
    ...p,
    name: pickText(p.name, lang),
    description: pickText(p.description, lang),
    totalProgress: parseFloat(totalProgress.toFixed(2)),
    nextMilestone: {
      name: pickText(p.nextMilestone.name, lang),
      date: p.nextMilestone.date,
    },
  }
}

function mapRisk(r: LocalizedRisk, lang: Lang): RiskItem {
  return {
    ...r,
    title: pickText(r.title, lang),
    cause: pickText(r.cause, lang),
    action: pickText(r.action, lang),
    expectedImpact: pickText(r.expectedImpact, lang),
  }
}

export async function fetchPortfolioDashboard(lang: Lang): Promise<PortfolioDashboard> {
  if (!isMockMode()) {
    const { data } = await apiClient.get<PortfolioDashboard>('/dashboard', { params: { lang } })
    return data
  }

  await sleep(250)

  const user = getCurrentUser()
  
  let projects = [...db.projects]
  if (user && user.role === 'USER') {
    projects = projects.filter(p => p.pmId === user.id)
  }

  const sortedProjects = projects
    .sort((a, b) => {
      const statusRank = (s: typeof a.status) => (s === 'RED' ? 3 : s === 'YELLOW' ? 2 : 1)
      const byStatus = statusRank(b.status) - statusRank(a.status)
      if (byStatus !== 0) return byStatus
      return a.id.localeCompare(b.id)
    })
    .map((p) => mapProject(p, lang))

  const totalProjects = sortedProjects.length
  const inProgressProjects = sortedProjects.length
  const onTrackCount = sortedProjects.filter((p) => p.status === 'GREEN').length
  const onTrackPercent = totalProjects === 0 ? 0 : (onTrackCount / totalProjects) * 100
  const atRiskProjects = sortedProjects.filter((p) => p.status !== 'GREEN').length
  const criticalTasks = sortedProjects.reduce((sum, p) => sum + p.criticalTaskCount, 0)
  const deliverableApprovalRate = sortedProjects.length === 0 ? 0 : mean(sortedProjects.map((p) => p.deliverableApprovalRate))
  const portfolioSvAvg = sortedProjects.length === 0 ? 0 : mean(sortedProjects.map((p) => p.svThisWeek))

  const kpis: PortfolioKpis = {
    totalProjects,
    inProgressProjects,
    onTrackPercent,
    atRiskProjects,
    criticalTasks,
    deliverableApprovalRate,
    portfolioSvAvg,
  }

  let risks = [...db.risks]
  if (user && user.role === 'USER') {
    risks = risks.filter(r => r.ownerId === user.id || projects.some(p => p.id === r.projectId))
  }

  const topRisks = risks
    .sort((a, b) => {
      const bySeverity = severityScore(b.severity) - severityScore(a.severity)
      if (bySeverity !== 0) return bySeverity
      return a.targetDate.localeCompare(b.targetDate)
    })
    .slice(0, 5)
    .map((r) => mapRisk(r, lang))

  return {
    asOfDate: db.asOfDate,
    kpis,
    projects: sortedProjects,
    topRisks,
  }
}
