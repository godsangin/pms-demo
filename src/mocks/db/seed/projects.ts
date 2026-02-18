import type { LocalizedProject } from '@/mocks/db/seed/types'

export const projectsSeed: LocalizedProject[] = [
  {
    id: 'P-1042',
    name: {
      en: 'ERP Finance Modernization',
      ko: 'ERP 재무 모더나이제이션',
    },
    description: {
      en: 'Legacy GL/AR/AP re-platforming with phased cutover',
      ko: '레거시 GL/AR/AP 재구축 및 단계적 전환',
    },
    pmName: 'J. Kim',
    startDate: '2025-11-04',
    endDate: '2026-06-30',
    status: 'GREEN',
    svThisWeek: 2.4,
    nextMilestone: {
      name: { en: 'UAT Entry', ko: 'UAT 착수' },
      date: '2026-03-06',
    },
    highRiskCount: 1,
    deliverableApprovalRate: 94,
    criticalTaskCount: 3,
  },
  {
    id: 'P-1098',
    name: {
      en: 'Software Build Program',
      ko: '소프트웨어 구축',
    },
    description: {
      en: 'Stage-based delivery governance (analysis/design -> dev -> test -> deployment)',
      ko: '단계별(분석/설계-개발-테스트-이행) 진척/산출물/테스트 통합 관리',
    },
    pmName: 'S. Park',
    startDate: '2025-10-14',
    endDate: '2026-05-16',
    status: 'GREEN',
    svThisWeek: 1.1,
    nextMilestone: {
      name: { en: 'Integration Test Entry', ko: '통합테스트 착수' },
      date: '2026-02-28',
    },
    highRiskCount: 1,
    deliverableApprovalRate: 91,
    criticalTaskCount: 2,
  },
  {
    id: 'P-1120',
    name: {
      en: 'Plant MES Rollout',
      ko: '공장 MES 롤아웃',
    },
    description: {
      en: 'MES standardization across 3 plants (Phase 1)',
      ko: '3개 공장 MES 표준화(1단계)',
    },
    pmName: 'H. Lee',
    startDate: '2025-12-02',
    endDate: '2026-08-29',
    status: 'YELLOW',
    svThisWeek: -3.6,
    nextMilestone: {
      name: { en: 'Line-1 Go-Live', ko: '1라인 Go-Live' },
      date: '2026-03-20',
    },
    highRiskCount: 2,
    deliverableApprovalRate: 86,
    criticalTaskCount: 7,
  },
  {
    id: 'P-1187',
    name: {
      en: 'Omni Channel Order Platform',
      ko: '옴니채널 주문 플랫폼',
    },
    description: {
      en: 'Realtime order orchestration + inventory promise',
      ko: '실시간 주문 오케스트레이션 및 재고 ATP(약속재고) 구현',
    },
    pmName: 'M. Choi',
    startDate: '2025-09-09',
    endDate: '2026-04-25',
    status: 'RED',
    svThisWeek: -12.8,
    nextMilestone: {
      name: { en: 'Cutover Readiness', ko: '전환 준비도 점검' },
      date: '2026-03-01',
    },
    highRiskCount: 3,
    deliverableApprovalRate: 72,
    criticalTaskCount: 18,
  },
]
