import type { ProjectTask } from '@/shared/types/pms'

export const tasksSeedByProjectId: Record<string, ProjectTask[]> = {
  'P-2026': [
    // 1. 프로젝트관리 (Phase 1)
    { id: 'T-1-1', projectId: 'P-2026', phaseId: 1, category: 'MILESTONE', name: '사업수행계획수립', orgName: '한국조폐공사', managerId: '00000000-0000-0000-0000-000000000001', progressPct: 80, isRequiredDeliverable: true, startDate: '2026-03-01', endDate: '2026-03-14', status: 'IN_PROGRESS' },
    { id: 'T-1-2', projectId: 'P-2026', phaseId: 1, category: 'PERIODIC', name: '주간업무보고', orgName: '한국조폐공사', managerId: '00000000-0000-0000-0000-000000000001', progressPct: 25, isRequiredDeliverable: true, startDate: '2026-02-23', endDate: '2026-06-30', status: 'IN_PROGRESS' },
    { id: 'T-1-3', projectId: 'P-2026', phaseId: 1, category: 'MILESTONE', name: '착수보고', orgName: '한국조폐공사', managerId: '00000000-0000-0000-0000-000000000001', progressPct: 0, isRequiredDeliverable: true, startDate: '2026-04-01', endDate: '2026-04-01', status: 'READY' },
    
    // 2. 분석/설계 (Phase 2)
    { id: 'T-2-1', projectId: 'P-2026', phaseId: 2, category: 'DELIVERABLE', name: '요구사항분석', orgName: '한국조폐공사', managerId: '00000000-0000-0000-0000-000000000001', progressPct: 100, isRequiredDeliverable: true, startDate: '2026-03-01', endDate: '2026-03-14', status: 'COMPLETED' },
    { id: 'T-2-2', projectId: 'P-2026', phaseId: 2, category: 'DELIVERABLE', name: '현황 및 요구사항 분석(소비자 분석)', orgName: '핑거', managerId: '00000000-0000-0000-0000-000000000004', progressPct: 31, isRequiredDeliverable: true, startDate: '2026-02-23', endDate: '2026-03-20', status: 'IN_PROGRESS' },
    { id: 'T-2-3', projectId: 'P-2026', phaseId: 2, category: 'DELIVERABLE', name: '온누리상품권 가맹 관리 분석', orgName: '더큰소프트', managerId: '00000000-0000-0000-0000-000000000003', progressPct: 45, isRequiredDeliverable: true, startDate: '2026-03-15', endDate: '2026-04-10', status: 'IN_PROGRESS' },
  ]
}
