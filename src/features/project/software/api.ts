import { apiClient } from '@/shared/api/client'
import type { Lang } from '@/shared/i18n/dict'
import type { ProgramItem, DeliverableItem } from '@/shared/types/pms'

export async function fetchPrograms(projectId: string, lang: Lang) {
  const { data } = await apiClient.get<any[]>(`/projects/${projectId}/tasks`, { params: { lang } })
  // 카테고리가 PROGRAM인 것만 필터링
  return data.filter(t => t.category === 'PROGRAM')
}

export async function fetchStageProgress(projectId: string) {
  const { data } = await apiClient.get<any>(`/projects/${projectId}`)
  return data.phases || []
}

export async function fetchTestScenarios(projectId: string, lang: Lang) {
  const { data } = await apiClient.get<any[]>(`/projects/${projectId}/tasks`, { params: { lang } })
  // 카테고리가 SCENARIO인 것만 필터링
  return data.filter(t => t.category === 'SCENARIO')
}

// 결함 목록 조회
export async function fetchDefects(projectId: string) {
  const { data } = await apiClient.get<any[]>(`/projects/${projectId}/defects`)
  return data
}

// 개별 프로그램/테스크 업데이트 (실제 WAS 연동)
export async function updateProgram(projectId: string, programId: string, updates: Partial<ProgramItem>) {
  const { data } = await apiClient.patch(`/projects/${projectId}/tasks/${programId}`, updates)
  return data
}

// 신규 테스크 등록 (실제 WAS 연동)
export async function createTask(projectId: string, task: Partial<ProgramItem>) {
  const { data } = await apiClient.post(`/projects/${projectId}/tasks`, task)
  return data
}

// 신규 산출물 등록 (실제 WAS 연동)
export async function createDeliverable(projectId: string, deliverable: Partial<DeliverableItem>) {
  const { data } = await apiClient.post(`/projects/${projectId}/deliverables`, deliverable)
  return data
}

// 산출물 업데이트 (진척률 등)
export async function updateDeliverable(projectId: string, deliverableId: string, updates: Partial<DeliverableItem>) {
  const { data } = await apiClient.patch(`/projects/${projectId}/deliverables/${deliverableId}`, updates)
  return data
}

// 산출물 파일 업로드
export async function uploadDeliverableFile(projectId: string, deliverableId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const { data } = await apiClient.post(
    `/projects/${projectId}/deliverables/${deliverableId}/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

// 산출물 테일러링 업데이트 (필요 시 구현)
export async function updateDeliverableTailoring(_projectId: string, _deliverableId: string, _tailoring: any) {
  return { success: true }
}

// 프로그램 일괄 등록
export async function registerProgramsBulk(projectId: string, programs: any[]) {
  const { data } = await apiClient.post(`/projects/${projectId}/tasks/bulk`, { programs })
  return data
}

// 산출물 일괄 등록
export async function registerDeliverablesBulk(projectId: string, deliverables: any[]) {
  const { data } = await apiClient.post(`/projects/${projectId}/deliverables/bulk`, { deliverables })
  return data
}
