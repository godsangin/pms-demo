import type { LocalizedProject } from '@/mocks/db/seed/types'

export const projectsSeed: LocalizedProject[] = [
  {
    id: 'P-2026',
    name: {
      en: 'Consumption Data Analysis Project',
      ko: '소비데이터 분석 사업',
    },
    description: {
      en: 'Enhancement of consumption data and service optimization for Onnuri Gift Certificate',
      ko: '온누리상품권 소비데이터 고도화 및 서비스 최적화 사업',
    },
    pmName: 'S. I. Lee',
    startDate: '2026-02-23',
    endDate: '2026-12-18',
    status: 'GREEN',
    svThisWeek: 0.5,
    nextMilestone: {
      name: { en: 'Prototype Demonstration', ko: '프로토타입 시연' },
      date: '2026-05-15',
    },
    highRiskCount: 0,
    deliverableApprovalRate: 100,
    criticalTaskCount: 0,
  },
]
