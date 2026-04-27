import { apiClient, isMockMode } from '@/shared/api/client'
import { db } from '@/mocks/db'
import type { LocalizedDeliverable, LocalizedText } from '@/mocks/db/seed/types'
import type { Lang } from '@/shared/i18n/dict'
import { sleep } from '@/shared/lib/sleep'
import type { DeliverableItem, ProgressPoint, ProjectDetail, ProjectTask } from '@/shared/types/pms'
import { getCurrentUser } from '@/shared/lib/role'

function pickText(text: LocalizedText, lang: Lang) {
  return lang === 'ko' ? text.ko : text.en
}

export async function fetchProjectDetail(projectId: string, lang: Lang): Promise<ProjectDetail> {
  if (!isMockMode()) {
    const { data } = await apiClient.get<ProjectDetail>(`/projects/${projectId}`, { params: { lang } })
    return data
  }

  await sleep(220)
  const user = getCurrentUser()
  const project = db.projects.find((p) => p.id === projectId)
  
  if (!project) throw new Error(`Project not found: ${projectId}`)

  // 가중치 합산 진척률 계산 (CSV 데이터 기반)
  const phases = db.phases.filter(p => p.projectId === projectId)
  const totalProgress = phases.reduce((sum, p) => sum + (p.progressRate * p.weight / 100), 0)

  const mappedProject = {
    ...project,
    name: pickText(project.name, lang),
    description: pickText(project.description, lang),
    totalProgress: parseFloat(totalProgress.toFixed(2)),
    nextMilestone: {
      name: pickText(project.nextMilestone.name, lang),
      date: project.nextMilestone.date,
    },
  }

  const risks = db.risks
    .filter((r) => r.projectId === projectId)
    .filter((r) => {
      if (!user || user.role === 'ADMIN') return true
      return r.ownerId === user.id || project.pmId === user.id
    })
    .map((r) => {
      return {
        ...r,
        title: pickText(r.title, lang),
        cause: pickText(r.cause, lang),
        action: pickText(r.action, lang),
        expectedImpact: pickText(r.expectedImpact, lang),
      }
    })

  return { 
    project: mappedProject, 
    risks,
    phases: phases.map(p => ({
      id: p.id,
      type: p.phaseType,
      name: p.name,
      weight: p.weight,
      progressRate: p.progressRate
    }))
  }
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
  const user = getCurrentUser()
  const items = db.tasksByProjectId[projectId]
  if (!items) throw new Error(`Tasks not found: ${projectId}`)

  // 개발 단계(Phase 3)의 경우 프로그램 시드 데이터를 합쳐서 반환
  const programs = db.programsByProjectId[projectId] || []
  const allTasks = [...(items as any[]), ...programs]

  return allTasks
    .filter((t) => {
      if (!user || user.role === 'ADMIN') return true
      const project = db.projects.find(p => p.id === projectId)
      return t.managerId === user.id || (project && project.pmId === user.id)
    })
    .map((t) => ({
      ...t,
      name: (t as any).name.ko ? pickText((t as any).name, lang) : t.name as string,
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

export async function fetchProjectDefects(projectId: string): Promise<any[]> {
  if (!isMockMode()) {
    const { data } = await apiClient.get<any[]>(`/projects/${projectId}/defects`)
    return data
  }

  await sleep(150)
  return [] // Mock implementation returns empty for now
}

export async function importWbsCsv(projectId: string, file: File): Promise<{ updatedCount: number }> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post(`/projects/${projectId}/wbs/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
