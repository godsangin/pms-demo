import type { ProjectTask } from '@/shared/types/pms'

export const programsSeedByProjectId: Record<string, ProjectTask[]> = {
  'P-2026': [
    { id: 'PROG-001', projectId: 'P-2026', phaseId: 3, category: 'PROGRAM', name: '행사 선별 관리 목록 화면', orgName: '시루정보', managerId: '00000000-0000-0000-0000-000000000002', progressPct: 100, isRequiredDeliverable: true, startDate: '2026-04-06', endDate: '2026-04-10', status: 'COMPLETED' },
    { id: 'PROG-002', projectId: 'P-2026', phaseId: 3, category: 'PROGRAM', name: '행사 콘텐츠 게시 목록 화면', orgName: '시루정보', managerId: '00000000-0000-0000-0000-000000000002', progressPct: 0, isRequiredDeliverable: true, startDate: '2026-04-13', endDate: '2026-04-17', status: 'READY' },
    { id: 'PROG-003', projectId: 'P-2026', phaseId: 3, category: 'PROGRAM', name: '한국관광공사 Open API 응답값 적재 배치', orgName: '시루정보', managerId: '00000000-0000-0000-0000-000000000002', progressPct: 0, isRequiredDeliverable: true, startDate: '2026-03-04', endDate: '2026-04-03', status: 'READY' },
    { id: 'PROG-004', projectId: 'P-2026', phaseId: 3, category: 'PROGRAM', name: '지역 축제 공연 조회 API', orgName: '시루정보', managerId: '00000000-0000-0000-0000-000000000002', progressPct: 0, isRequiredDeliverable: true, startDate: '2026-04-03', endDate: '2026-04-07', status: 'READY' },
    { id: 'PROG-005', projectId: 'P-2026', phaseId: 3, category: 'PROGRAM', name: '지역 축제 공연 목록 모바일 UI', orgName: '핑거', managerId: '00000000-0000-0000-0000-000000000004', progressPct: 0, isRequiredDeliverable: true, startDate: '2026-04-20', endDate: '2026-05-06', status: 'READY' },
    { id: 'PROG-006', projectId: 'P-2026', phaseId: 3, category: 'PROGRAM', name: '가맹점 관리 AS-IS 분석 프로그램', orgName: '더큰소프트', managerId: '00000000-0000-0000-0000-000000000003', progressPct: 0, isRequiredDeliverable: true, startDate: '2026-04-10', endDate: '2026-04-20', status: 'READY' },
  ]
}
