-- 1. 기본 사용자 생성
-- password: 'password123' (실제 운영환경에서는 강력한 해싱 필요)
INSERT INTO users (id, username, password_hash, full_name, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'komsco', '$2b$12$ExYvX7U.zP.Z6S6X6X6X6uY6X6X6X6X6X6X6X6X6X6X6X6X6X6X6', '한국조폐공사 관리자', 'ADMIN'),
    ('00000000-0000-0000-0000-000000000002', 'seeroo', '$2b$12$ExYvX7U.zP.Z6S6X6X6X6uY6X6X6X6X6X6X6X6X6X6X6X6X6X6X6', '시루 담당자', 'USER'),
    ('00000000-0000-0000-0000-000000000003', 'dukn', '$2b$12$ExYvX7U.zP.Z6S6X6X6X6uY6X6X6X6X6X6X6X6X6X6X6X6X6X6X6', '덕은 담당자', 'USER'),
    ('00000000-0000-0000-0000-000000000004', 'pytha', '$2b$12$ExYvX7U.zP.Z6S6X6X6X6uY6X6X6X6X6X6X6X6X6X6X6X6X6X6X6', '피타 담당자', 'USER'),
    ('00000000-0000-0000-0000-000000000005', 'nice', '$2b$12$ExYvX7U.zP.Z6S6X6X6X6uY6X6X6X6X6X6X6X6X6X6X6X6X6X6X6', '나이스 담당자', 'USER');

-- 2. 샘플 프로젝트 생성
INSERT INTO projects (id, name, description, pm_id, start_date, end_date, total_progress)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
    '대외계 인터페이스 시스템 고도화', 
    'MSA 아키텍처 기반의 차세대 대외계 인터페이스 구축 프로젝트', 
    '00000000-0000-0000-0000-000000000001',
    CURRENT_DATE - INTERVAL '30 days', 
    CURRENT_DATE + INTERVAL '120 days',
    45.00
);

-- 3. 프로젝트 단계(Phases) 생성
INSERT INTO phases (project_id, phase_type, name, weight, progress_rate, sort_order)
VALUES 
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'MANAGEMENT', '사업관리', 10.00, 100.00, 1),
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'ANALYSIS', '분석/설계', 30.00, 80.00, 2),
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'DEVELOPMENT', '개발/테스트', 40.00, 20.00, 3),
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'INTEGRATION', '통합테스트', 15.00, 0.00, 4),
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'TRANSITION', '이행', 5.00, 0.00, 5);

-- 4. 샘플 테스크(Tasks) 생성
INSERT INTO tasks (phase_id, name, org_name, manager_id, progress_rate, task_type, start_date, end_date, status)
SELECT 
    id, '상세 설계서 작성', 'KOMSCO', '00000000-0000-0000-0000-000000000002', 100.00, 'REPORT', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '10 days', 'COMPLETED'
FROM phases WHERE phase_type = 'ANALYSIS';

INSERT INTO tasks (phase_id, name, org_name, manager_id, progress_rate, task_type, start_date, end_date, status)
SELECT 
    id, 'API 게이트웨이 개발', 'SEEROO', '00000000-0000-0000-0000-000000000002', 30.00, 'PROGRAM', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '15 days', 'IN_PROGRESS'
FROM phases WHERE phase_type = 'DEVELOPMENT';

-- 5. 샘플 리스크 생성
INSERT INTO risks (project_id, title, severity, status, owner_id, cause, action_plan, target_date)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    '인터페이스 규격 지연',
    'HIGH',
    'OPEN',
    '00000000-0000-0000-0000-000000000003',
    '유관기관 협의 지연',
    '주간 회의 시 쟁점 사항 보고 및 의사결정 요청',
    CURRENT_DATE + INTERVAL '7 days'
);
