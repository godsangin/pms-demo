import { db } from '@/mocks/db'
import type { Lang } from '@/shared/i18n/dict'
import { sleep } from '@/shared/lib/sleep'
import type { ProgramItem, DeliverableItem } from '@/shared/types/pms'

function pickText(text: { en: string; ko: string }, lang: Lang) {
  return lang === 'ko' ? text.ko : text.en
}

export async function fetchPrograms(projectId: string, lang: Lang) {
  await sleep(200)
  const items = db.programsByProjectId[projectId]
  if (!items) return []
  return items.map((p) => ({
    ...p,
    name: pickText(p.name, lang),
  }))
}

export async function fetchStageProgress(projectId: string) {
  await sleep(150)
  return db.stageProgressByProjectId[projectId] || []
}

export async function fetchTestScenarios(projectId: string, lang: Lang) {
  await sleep(200)
  const items = db.testScenariosByProjectId[projectId]
  if (!items) return []
  return items.map((s) => ({
    ...s,
    title: pickText(s.title, lang),
    evidenceNote: pickText(s.evidenceNote, lang),
  }))
}

// Bulk registration and updates (Mock only)
export async function registerProgramsBulk(_projectId: string, programs: any[]) {
  await sleep(500)
  return { registeredCount: programs.length }
}

export async function updateProgram(_projectId: string, _programId: string, _updates: Partial<ProgramItem>) {
  await sleep(200)
  return { success: true }
}

export async function updateDeliverableTailoring(_projectId: string, _deliverableId: string, _tailoring: any) {
  await sleep(200)
  return { success: true }
}

export async function createDeliverable(_projectId: string, _deliverable: Partial<DeliverableItem>) {
  await sleep(200)
  return { id: `D-\${Math.random().toString(36).substr(2, 9)}` }
}
