import { apiClient, isMockMode } from '@/shared/api/client'
import { db } from '@/mocks/db'
import type { LocalizedProject, LocalizedRisk, LocalizedText } from '@/mocks/db/seed/types'
import type { Lang } from '@/shared/i18n/dict'
import { sleep } from '@/shared/lib/sleep'
import type { PortfolioDashboard, PortfolioKpis, ProjectListItem, RiskItem } from '@/shared/types/pms'

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
  return {
    ...p,
    name: pickText(p.name, lang),
    description: pickText(p.description, lang),
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

  const projects = [...db.projects]
    .sort((a, b) => {
      const statusRank = (s: typeof a.status) => (s === 'RED' ? 3 : s === 'YELLOW' ? 2 : 1)
      const byStatus = statusRank(b.status) - statusRank(a.status)
      if (byStatus !== 0) return byStatus
      return a.id.localeCompare(b.id)
    })
    .map((p) => mapProject(p, lang))

  const totalProjects = projects.length
  const inProgressProjects = projects.length
  const onTrackCount = projects.filter((p) => p.status === 'GREEN').length
  const onTrackPercent = totalProjects === 0 ? 0 : (onTrackCount / totalProjects) * 100
  const atRiskProjects = projects.filter((p) => p.status !== 'GREEN').length
  const criticalTasks = projects.reduce((sum, p) => sum + p.criticalTaskCount, 0)
  const deliverableApprovalRate = mean(projects.map((p) => p.deliverableApprovalRate))
  const portfolioSvAvg = mean(projects.map((p) => p.svThisWeek))

  const kpis: PortfolioKpis = {
    totalProjects,
    inProgressProjects,
    onTrackPercent,
    atRiskProjects,
    criticalTasks,
    deliverableApprovalRate,
    portfolioSvAvg,
  }

  const topRisks = [...db.risks]
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
    projects,
    topRisks,
  }
}
