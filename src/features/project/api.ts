import { apiClient, isMockMode } from '@/shared/api/client'
import { db } from '@/mocks/db'
import type { LocalizedDeliverable, LocalizedTask, LocalizedText } from '@/mocks/db/seed/types'
import type { Lang } from '@/shared/i18n/dict'
import { sleep } from '@/shared/lib/sleep'
import type { DeliverableItem, ProgressPoint, ProjectDetail, ProjectTask } from '@/shared/types/pms'

function pickText(text: LocalizedText, lang: Lang) {
  return lang === 'ko' ? text.ko : text.en
}

export async function fetchProjectDetail(projectId: string, lang: Lang): Promise<ProjectDetail> {
  if (!isMockMode()) {
    const { data } = await apiClient.get<ProjectDetail>(`/projects/${projectId}`, { params: { lang } })
    return data
  }

  await sleep(220)
  const project = db.projects.find((p) => p.id === projectId)
  if (!project) throw new Error(`Project not found: ${projectId}`)

  const mappedProject = {
    ...project,
    name: pickText(project.name, lang),
    description: pickText(project.description, lang),
    nextMilestone: {
      name: pickText(project.nextMilestone.name, lang),
      date: project.nextMilestone.date,
    },
  }

  const risks = db.risks
    .filter((r) => r.projectId === projectId)
    .map((r) => {
      return {
        ...r,
        title: pickText(r.title, lang),
        cause: pickText(r.cause, lang),
        action: pickText(r.action, lang),
        expectedImpact: pickText(r.expectedImpact, lang),
      }
    })

  return { project: mappedProject, risks }
}

export async function fetchProjectProgress(projectId: string): Promise<ProgressPoint[]> {
  if (!isMockMode()) {
    const { data } = await apiClient.get<ProgressPoint[]>(`/projects/${projectId}/progress`)
    return data
  }

  await sleep(220)
  const points = db.progressByProjectId[projectId]
  if (!points) throw new Error(`Progress not found: ${projectId}`)
  return points
}

export async function fetchProjectTasks(projectId: string, lang: Lang): Promise<ProjectTask[]> {
  if (!isMockMode()) {
    const { data } = await apiClient.get<ProjectTask[]>(`/projects/${projectId}/tasks`, { params: { lang } })
    return data
  }

  await sleep(200)
  const items = db.tasksByProjectId[projectId]
  if (!items) throw new Error(`Tasks not found: ${projectId}`)
  return (items as LocalizedTask[]).map((t) => ({
    ...t,
    name: pickText(t.name, lang),
  }))
}

export async function fetchProjectDeliverables(projectId: string, lang: Lang): Promise<DeliverableItem[]> {
  if (!isMockMode()) {
    const { data } = await apiClient.get<DeliverableItem[]>(`/projects/${projectId}/deliverables`, { params: { lang } })
    return data
  }

  await sleep(200)
  const items = db.deliverablesByProjectId[projectId]
  if (!items) throw new Error(`Deliverables not found: ${projectId}`)
  return (items as LocalizedDeliverable[]).map((d) => ({
    ...d,
    title: pickText(d.title, lang),
  }))
}
