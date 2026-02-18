import { db } from '@/mocks/db'
import type {
  LocalizedProgram,
  LocalizedTestScenario,
  LocalizedText,
} from '@/mocks/db/seed/types'
import type { Lang } from '@/shared/i18n/dict'
import { sleep } from '@/shared/lib/sleep'
import type { ProgramItem, StageProgress, TestScenario } from '@/shared/types/pms'

function pickText(text: LocalizedText, lang: Lang) {
  return lang === 'ko' ? text.ko : text.en
}

export async function fetchPrograms(projectId: string, lang: Lang) {
  await sleep(200)
  const items = db.programsByProjectId[projectId]
  if (!items) return []
  const result: ProgramItem[] = (items as LocalizedProgram[]).map((p) => ({
    ...p,
    name: pickText(p.name, lang),
  }))
  return result
}

export async function fetchTestScenarios(projectId: string, lang: Lang) {
  await sleep(220)
  const items = db.testScenariosByProjectId[projectId]
  if (!items) return []
  const result: TestScenario[] = (items as LocalizedTestScenario[]).map((s) => ({
    ...s,
    title: pickText(s.title, lang),
    evidenceNote: pickText(s.evidenceNote, lang),
  }))
  return result
}

export async function fetchStageProgress(projectId: string) {
  await sleep(160)
  const items = db.stageProgressByProjectId[projectId]
  if (!items) return []
  const result: StageProgress[] = items
  return result
}
