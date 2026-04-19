import type { LocalizedDeliverable } from '@/mocks/db/seed/types'

export const deliverablesSeedByProjectId: Record<string, LocalizedDeliverable[]> = {
  'P-2026': [
    {
      id: 'D-2026-01',
      projectId: 'P-2026',
      title: { en: 'Project Execution Plan', ko: '사업수행계획서' },
      status: 'ACCEPTED',
      dueDate: '2026-03-15',
      submittedDate: '2026-03-12',
      decidedDate: '2026-03-14',
    },
    {
      id: 'D-2026-02',
      projectId: 'P-2026',
      title: { en: 'Requirements Definition', ko: '요구사항 정의서' },
      status: 'ACCEPTED',
      dueDate: '2026-03-31',
      submittedDate: '2026-03-30',
      decidedDate: '2026-03-31',
    },
    {
      id: 'D-2026-03',
      projectId: 'P-2026',
      title: { en: 'Screen Design (UI/UX)', ko: '화면설계서' },
      status: 'SUBMITTED',
      dueDate: '2026-04-30',
      submittedDate: '2026-04-15',
    },
    {
      id: 'D-2026-04',
      projectId: 'P-2026',
      title: { en: 'Unit Test Report', ko: '단위테스트 결과서' },
      status: 'PLANNED',
      dueDate: '2026-05-31',
    },
  ],
}
