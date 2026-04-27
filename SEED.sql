-- ONDA Project Initial Seed Data (Fixed UUID version)

-- 기존 데이터 정리 (개발용)
DELETE FROM deliverables;
DELETE FROM defects;
DELETE FROM tasks;
DELETE FROM phases;
DELETE FROM projects;
DELETE FROM users;

-- 1. 사용자 (기본 관리자 및 담당자)
INSERT INTO users (id, username, password_hash, full_name, org_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'komsco', '$2b$10$ZxI5Lj5R8ZiFFFGzjDhueOR37xsixuWai7a9ihOECnFVwMbk5VaYS', '조폐공사 관리자', '한국조폐공사', 'ADMIN'),
('00000000-0000-0000-0000-000000000002', 'seeroo', '$2b$10$ZxI5Lj5R8ZiFFFGzjDhueOR37xsixuWai7a9ihOECnFVwMbk5VaYS', '시루 담당자', '시루', 'USER'),
('00000000-0000-0000-0000-000000000003', 'dukn', '$2b$10$ZxI5Lj5R8ZiFFFGzjDhueOR37xsixuWai7a9ihOECnFVwMbk5VaYS', '덕은 담당자', '덕은', 'USER'),
('00000000-0000-0000-0000-000000000004', 'pytha', '$2b$10$ZxI5Lj5R8ZiFFFGzjDhueOR37xsixuWai7a9ihOECnFVwMbk5VaYS', '피타 담당자', '피타', 'USER'),
('00000000-0000-0000-0000-000000000005', 'nice', '$2b$10$ZxI5Lj5R8ZiFFFGzjDhueOR37xsixuWai7a9ihOECnFVwMbk5VaYS', '나이스 담당자', '나이스', 'USER');

-- 2. 프로젝트 (UUID 형식 준수)
INSERT INTO projects (id, name, description, pm_id, start_date, end_date, status, total_progress, sv_this_week) VALUES
('00000000-0000-0000-0000-000000002026', '온누리상품권 홈페이지 소비데이터 고도화 사업', '온누리상품권 소비데이터 고도화 및 서비스 최적화 프로젝트', '00000000-0000-0000-0000-000000000001', '2026-02-23', '2026-12-18', 'GREEN', 12.16, 4.5);

-- 3. 프로젝트 단계 (Phases)
INSERT INTO phases (project_id, phase_type, name, weight, progress_rate, sort_order) VALUES
('00000000-0000-0000-0000-000000002026', 'MANAGEMENT', '프로젝트관리', 10.00, 13.13, 1),
('00000000-0000-0000-0000-000000002026', 'ANALYSIS', '분석/설계', 30.00, 36.15, 2),
('00000000-0000-0000-0000-000000002026', 'DEVELOPMENT', '개발', 40.00, 5.00, 3),
('00000000-0000-0000-0000-000000002026', 'TEST', '테스트', 15.00, 0.00, 4),
('00000000-0000-0000-0000-000000002026', 'TRANSITION', '이행', 5.00, 0.00, 5);

-- 4. 주요 테스크 (WBS 기반)
-- 프로젝트 관리 단계 테스크 (서브쿼리로 phase_id 조회)
INSERT INTO tasks (phase_id, category, name, org_name, manager_id, progress_rate, wbs_code, depth, weight, baseline_start, baseline_end, status) VALUES
((SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'MANAGEMENT'), 'PERIODIC', '사업수행계획수립', '한국조폐공사', '00000000-0000-0000-0000-000000000002', 80.00, 'Project 1.2.1', 3, 0.50, '2026-03-03', '2026-03-20', 'IN_PROGRESS'),
((SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'MANAGEMENT'), 'PERIODIC', '주간업무보고', '한국조폐공사', '00000000-0000-0000-0000-000000000002', 25.00, 'Project 1.2.2', 3, 0.50, '2026-02-23', '2026-06-30', 'IN_PROGRESS'),
((SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'MANAGEMENT'), 'MILESTONE', '착수보고', '한국조폐공사', '00000000-0000-0000-0000-000000000002', 0.00, 'Project 1.3.1', 3, 0.25, '2026-04-01', '2026-04-01', 'READY');

-- 분석/설계 단계 테스크
INSERT INTO tasks (phase_id, category, name, org_name, manager_id, progress_rate, wbs_code, depth, weight, baseline_start, baseline_end, status) VALUES
((SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'ANALYSIS'), 'COMMON', '요구사항분석', '한국조폐공사', '00000000-0000-0000-0000-000000000002', 100.00, 'Project 2.1', 2, 0.10, '2026-03-02', '2026-03-20', 'COMPLETED'),
((SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'ANALYSIS'), 'DELIVERABLE', 'DB 설계서 작성', '한국조폐공사', '00000000-0000-0000-0000-000000000002', 45.00, 'Project 2.3.1', 3, 0.20, '2026-04-01', '2026-04-30', 'IN_PROGRESS');

-- 5. 프로그램 목록 (개발 단계 테스크)
INSERT INTO tasks (id, phase_id, category, name, org_name, manager_id, progress_rate, wbs_code, depth, weight, baseline_start, baseline_end, status) VALUES
('00000000-0000-0000-0000-000000001001', (SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'DEVELOPMENT'), 'PROGRAM', '행사 선별 관리 목록 화면', '더큰소프트', '00000000-0000-0000-0000-000000000003', 100.00, 'Project 3.1.1', 3, 0.01, '2026-04-06', '2026-04-10', 'DONE'),
('00000000-0000-0000-0000-000000001002', (SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'DEVELOPMENT'), 'PROGRAM', '행사 선별 관리 상세 화면', '더큰소프트', '00000000-0000-0000-0000-000000000003', 100.00, 'Project 3.1.2', 3, 0.01, '2026-04-11', '2026-04-15', 'DONE'),
('00000000-0000-0000-0000-000000001003', (SELECT id FROM phases WHERE project_id = '00000000-0000-0000-0000-000000002026' AND phase_type = 'DEVELOPMENT'), 'PROGRAM', '가맹점 관리 AS-IS 분석', '더큰소프트', '00000000-0000-0000-0000-000000000003', 0.00, 'Project 3.2.1', 3, 0.01, '2026-04-10', '2026-04-20', 'READY');

-- 6. 초기 산출물 데이터
INSERT INTO deliverables (project_id, title, status, due_date, stage) VALUES
('00000000-0000-0000-0000-000000002026', '사업수행계획서', 'ACCEPTED', '2026-03-20', 'ANALYSIS_DESIGN'),
('00000000-0000-0000-0000-000000002026', '요구사항정의서', 'ACCEPTED', '2026-03-31', 'ANALYSIS_DESIGN');
