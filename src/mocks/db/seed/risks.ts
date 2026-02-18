import type { LocalizedRisk } from '@/mocks/db/seed/types'

export const risksSeed: LocalizedRisk[] = [
  {
    id: 'R-9001',
    projectId: 'P-1187',
    severity: 'CRITICAL',
    status: 'OPEN',
    title: {
      en: 'Cutover interface contract not frozen',
      ko: '전환 인터페이스 계약 미동결',
    },
    owner: 'Integration Lead',
    cause: {
      en: 'External fulfillment interface changes not frozen; rework cycles repeat',
      ko: '외부 풀필먼트 인터페이스 변경이 동결되지 않아 재작업이 반복됨',
    },
    action: {
      en: 'Freeze interface contract; enforce change window; add daily triage with vendor',
      ko: '인터페이스 계약 동결, 변경 윈도우 운영, 벤더 일일 트리아지 진행',
    },
    expectedImpact: {
      en: 'Reduce rework; stabilize cutover plan; recover 1-2 weeks',
      ko: '재작업 감소, 전환 계획 안정화, 1~2주 일정 회복',
    },
    targetDate: '2026-02-25',
  },
  {
    id: 'R-9002',
    projectId: 'P-1187',
    severity: 'HIGH',
    status: 'MITIGATING',
    title: {
      en: 'Perf test gap vs production',
      ko: '성능 테스트 환경 격차',
    },
    owner: 'Platform Lead',
    cause: {
      en: 'Performance test environment not representative; bottlenecks discovered late',
      ko: '성능 테스트 환경이 실환경과 상이하여 병목이 후반에 발견됨',
    },
    action: {
      en: 'Provision prod-like dataset; run 2-week perf sprint; lock SLOs',
      ko: '실환경급 데이터셋 구성, 2주 성능 스프린트 수행, SLO 동결',
    },
    expectedImpact: {
      en: 'Prevent go-live rollback; improve throughput predictability',
      ko: '오픈 후 롤백 리스크 감소, 처리량 예측 가능성 개선',
    },
    targetDate: '2026-03-04',
  },
  {
    id: 'R-9003',
    projectId: 'P-1187',
    severity: 'HIGH',
    status: 'OPEN',
    title: {
      en: 'SME review latency',
      ko: 'SME 검토 지연',
    },
    owner: 'PMO',
    cause: {
      en: 'Key SMEs split across BAU and project work; review latency increasing',
      ko: '핵심 SME가 BAU/프로젝트를 병행하며 검토 리드타임이 증가',
    },
    action: {
      en: 'Timebox SME allocation; add proxy approvers; set SLA for reviews',
      ko: 'SME 투입시간 타임박싱, 대리 승인자 지정, 검토 SLA 설정',
    },
    expectedImpact: {
      en: 'Unblock deliverables; raise approval rate to 80%+',
      ko: '산출물 병목 해소, 승인율 80%+ 회복',
    },
    targetDate: '2026-03-08',
  },
  {
    id: 'R-9101',
    projectId: 'P-1120',
    severity: 'HIGH',
    status: 'MITIGATING',
    title: {
      en: 'Shift-time network latency spikes',
      ko: '교대 시간대 네트워크 지연',
    },
    owner: 'Infra Lead',
    cause: {
      en: 'Plant network latency spikes during shift changes',
      ko: '교대 시간대에 공장망 지연이 급증',
    },
    action: {
      en: 'Tune QoS; deploy local cache; add monitoring with alerting',
      ko: 'QoS 튜닝, 로컬 캐시 적용, 모니터링/알림 체계 추가',
    },
    expectedImpact: {
      en: 'Improve station response time; protect go-live scope',
      ko: '현장 응답시간 개선, Go-Live 범위 보호',
    },
    targetDate: '2026-03-10',
  },
  {
    id: 'R-9102',
    projectId: 'P-1120',
    severity: 'HIGH',
    status: 'OPEN',
    title: {
      en: 'SOP/training content not ready',
      ko: 'SOP/교육 콘텐츠 미완료',
    },
    owner: 'Plant Ops',
    cause: {
      en: 'Standard work instructions not aligned; training content incomplete',
      ko: '표준 작업지침이 정합되지 않았고 교육 콘텐츠가 미완성',
    },
    action: {
      en: 'Finalize SOP baseline; run train-the-trainer; sign-off by plant ops',
      ko: 'SOP 기준안 확정, TtT(Train-the-trainer) 운영, 현장 운영팀 승인',
    },
    expectedImpact: {
      en: 'Reduce adoption risk; lower defect leakage',
      ko: '정착 리스크 감소, 결함 유입 감소',
    },
    targetDate: '2026-03-15',
  },
  {
    id: 'R-9201',
    projectId: 'P-1042',
    severity: 'HIGH',
    status: 'CLOSED',
    title: {
      en: 'AR reconciliation rule decision pending',
      ko: 'AR 대사 규칙 의사결정 지연',
    },
    owner: 'Finance Lead',
    cause: {
      en: 'AR reconciliation rules still under debate with finance',
      ko: 'AR 대사 규칙이 재무 조직과 아직 합의되지 않음',
    },
    action: {
      en: 'Decision workshop; document rules; config lock for UAT',
      ko: '의사결정 워크숍 개최, 규칙 문서화, UAT를 위한 설정 동결',
    },
    expectedImpact: {
      en: 'Avoid UAT scope churn; protect schedule',
      ko: 'UAT 스코프 변동 방지, 일정 보호',
    },
    targetDate: '2026-02-27',
  },
]
