-- 1. 샘플 프로젝트 생성 (대외계 시스템 고도화)
INSERT INTO projects (id, name, description, status, start_date, end_date)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
    '대외계 인터페이스 시스템 고도화', 
    'MSA 아키텍처 기반의 차세대 대외계 인터페이스 구축 프로젝트', 
    'IN_PROGRESS', 
    CURRENT_DATE - INTERVAL '30 days', 
    CURRENT_DATE + INTERVAL '120 days'
);

-- 2. 소프트웨어 특화 정보 연동
INSERT INTO software_projects (project_id, tech_stack, git_repo_url, architecture_type, ci_cd_status)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
    '{"React", "NestJS", "PostgreSQL", "Kafka"}', 
    'https://github.com/pms-demo/external-api-core', 
    'Microservices', 
    'SUCCESS'
);

-- 3. SDLC 단계(Stages) 생성
INSERT INTO stages (id, project_id, name, "order", status, progress)
VALUES 
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '요구분석', 1, 'COMPLETED', 100.00),
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '시스템설계', 2, 'COMPLETED', 100.00),
    ('b2c3d4e5-f6a7-4b6c-9d8e-1f2a3b4c5d6e', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '개발구현', 3, 'IN_PROGRESS', 45.00),
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '통합테스트', 4, 'NOT_STARTED', 0.00),
    (uuid_generate_v4(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '안정화', 5, 'NOT_STARTED', 0.00);

-- 4. 샘플 산출물(Deliverables) 생성 (개발구현 단계)
INSERT INTO deliverables (stage_id, name, type, file_url, status)
VALUES 
    ('b2c3d4e5-f6a7-4b6c-9d8e-1f2a3b4c5d6e', 'API 명세서(v1.2)', 'DOC', 'https://wiki.pms.com/deliverables/api-spec', 'APPROVED'),
    ('b2c3d4e5-f6a7-4b6c-9d8e-1f2a3b4c5d6e', 'DB 스키마 정의서', 'DOC', 'https://wiki.pms.com/deliverables/db-schema', 'APPROVED'),
    ('b2c3d4e5-f6a7-4b6c-9d8e-1f2a3b4c5d6e', '핵심 로직 소스코드', 'CODE', 'https://github.com/repo/tree/main/src', 'PENDING');

-- 5. 테스트 현황 요약
INSERT INTO test_summaries (project_id, total_cases, passed_cases, failed_cases)
VALUES ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 150, 142, 8);

-- 6. 투입 인력 리소스
INSERT INTO project_resources (project_id, user_name, role, effort_mm)
VALUES 
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '김철수', 'PM', 1.0),
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '이영희', 'Backend Dev', 1.0),
    ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '박민수', 'Frontend Dev', 0.5);
