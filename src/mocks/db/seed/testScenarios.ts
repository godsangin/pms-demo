import type { LocalizedTestScenario } from '@/mocks/db/seed/types'

export const testScenariosSeedByProjectId: Record<string, LocalizedTestScenario[]> = {
  'P-2026': [
    {
      id: 'UT-2026-001',
      projectId: 'P-2026',
      programId: 'PG-2026-01',
      type: 'UNIT',
      title: { en: 'Event list search filters', ko: '행사 목록 검색 필터링' },
      status: 'EXECUTED',
      result: 'PASS',
      owner: '정진솔',
      evidenceNote: { en: 'Filter result capture: UT-2026-001.png', ko: '필터 결과 캡처: UT-2026-001.png' },
      intakeStatus: 'RECEIVED',
      executedDate: '2026-04-10',
    },
    {
      id: 'UT-2026-002',
      projectId: 'P-2026',
      programId: 'PG-2026-13',
      type: 'UNIT',
      title: { en: 'Open API response parsing', ko: 'Open API 응답 파싱' },
      status: 'EXECUTED',
      result: 'PASS',
      owner: '정진솔',
      evidenceNote: { en: 'JSON parsing log check', ko: 'JSON 파싱 로그 확인 완료' },
      intakeStatus: 'RECEIVED',
      executedDate: '2026-03-25',
    },
  ],
}
