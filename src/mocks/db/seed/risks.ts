import type { LocalizedRisk } from '@/mocks/db/seed/types'

export const risksSeed: LocalizedRisk[] = [
  {
    id: 'R-2026-01',
    projectId: 'P-2026',
    severity: 'MEDIUM',
    status: 'OPEN',
    title: {
      en: 'External API integration delay',
      ko: '외부 연계기관 API 제공 지연',
    },
    owner: 'Technical Lead',
    cause: {
      en: 'Delay in provisioning API credentials from external data provider',
      ko: '외부 데이터 제공 기관의 API 인증 정보 발급 지연',
    },
    action: {
      en: 'Escalation via official channel; use mock data for initial development',
      ko: '공식 채널을 통한 촉구 공문 발송 및 초기 개발용 Mock 데이터 활용',
    },
    expectedImpact: {
      en: 'Prevent schedule slip; ensure prototype demonstration date',
      ko: '일정 지연 방지 및 프로토타입 시연 일정 준수',
    },
    targetDate: '2026-05-10',
  },
]
