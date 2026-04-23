# PMS PostgreSQL Database Guide

## 1. Schema Overview
본 시스템은 프로젝트 진척률의 **정량적 자동 산정**을 위해 설계되었습니다.

### 핵심 테이블 구조
- **projects**: 전체 진척률(`total_progress`) 저장.
- **phases**: 프로젝트 5단계 및 가중치(`weight`) 관리.
- **tasks**: 테스크별 진척률 및 카테고리(`category`) 관리.
- **defects**: 테스트 단계 결함 관리 및 조치 상태 추적.

## 2. 진척률 산정 공식

### Phase 진척률 (Progress Rate)
- **MANAGEMENT**: MILESTONE(0/100%) 및 PERIODIC(날짜 기반) 테스크의 가중 평균.
- **ANALYSIS**: `is_required_deliverable = TRUE`인 테스크의 산술 평균.
- **DEVELOPMENT**: 등록된 프로그램 목록(PROGRAM)의 진척률 평균.
- **INTEGRATION**: 테스트 시나리오(SCENARIO) 통과율 기반.

### Project 총 진척률 (Total Progress)
```sql
total_progress = Σ(Phase_Progress_Rate * Phase_Weight / 100)
```

## 3. 주요 쿼리 예시

### 수행기관별 평균 진척률 및 생산성 조회
```sql
SELECT 
    org_name, 
    AVG(progress_rate) as avg_progress,
    COUNT(*) as task_count
FROM tasks
GROUP BY org_name;
```

### 결함 현황 요약
```sql
SELECT 
    status, 
    COUNT(*) as count
FROM defects
GROUP BY status;
```
