import { db } from '@/mocks/db'
import type { LocalizedProject, LocalizedRisk, LocalizedText } from '@/mocks/db/seed/types'
import type { Lang } from '@/shared/i18n/dict'
import { sleep } from '@/shared/lib/sleep'
import type { ProjectListItem, RiskItem } from '@/shared/types/pms'

import type { RiskBoardData, RiskBoardItem } from '@/features/risk/types'

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

export async function fetchRisksBoard(lang: Lang) {
  await sleep(250)

  const projects = db.projects.map((p) => mapProject(p, lang))
  const risks = db.risks.map((r) => mapRisk(r, lang))

  const projectById = new Map(projects.map((p) => [p.id, p] as const))
  const items: RiskBoardItem[] = risks
    .map((r) => {
      const p = projectById.get(r.projectId)
      if (!p) return undefined
      return { risk: r, project: { id: p.id, name: p.name, status: p.status, svThisWeek: p.svThisWeek } }
    })
    .filter((x): x is RiskBoardItem => Boolean(x))

  const result: RiskBoardData = {
    asOfDate: db.asOfDate,
    items,
  }

  return result
}
