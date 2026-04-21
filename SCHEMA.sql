-- PostgreSQL 초기 스키마 설정 (Software PMS)
-- psql -U postgres -d pms -f SCHEMA.sql

-- 1. UUID 확장 모듈 활성화 (여전히 다른 테이블에서 쓸 수 있으므로 유지)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 프로젝트 테이블 (기본 정보 및 KPI 합산 정보 포함)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY, -- 'P-2026' 형식 지원
    name JSONB NOT NULL,        -- { "ko": "...", "en": "..." }
    description JSONB,          -- { "ko": "...", "en": "..." }
    pm_name VARCHAR(100),
    lifecycle_status VARCHAR(50) DEFAULT 'PLANNING', -- 생명주기 상태 (PLANNING, IN_PROGRESS 등)
    status VARCHAR(20) DEFAULT 'GREEN', -- 'GREEN', 'YELLOW', 'RED' (프론트엔드에서 status로 사용)
    sv_this_week NUMERIC(5, 2) DEFAULT 0.00,
    deliverable_approval_rate NUMERIC(5, 2) DEFAULT 0.00,
    critical_task_count INT DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 소프트웨어 특화 정보 테이블 (Project와 1:1)
CREATE TABLE IF NOT EXISTS software_projects (
    project_id VARCHAR(50) PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    tech_stack TEXT[], -- 문자열 배열 (e.g., {'React', 'NestJS'})
    git_repo_url VARCHAR(255),
    architecture_type VARCHAR(100),
    ci_cd_status VARCHAR(50) DEFAULT 'STABLE'
);

-- 4. SDLC 단계 테이블 (Project와 1:N)
CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name JSONB NOT NULL,        -- 단계명 지역화
    "order" INT NOT NULL,       -- 단계 순서
    status VARCHAR(50) DEFAULT 'NOT_STARTED',
    progress NUMERIC(5, 2) DEFAULT 0.00, -- 진행률 (0~100)
    UNIQUE(project_id, "order")
);

-- 5. 산출물 테이블 (Project/Stage와 관계)
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
    title JSONB NOT NULL,       -- 산출물명 지역화
    status VARCHAR(50) DEFAULT 'PLANNED', -- PLANNED, SUBMITTED, ACCEPTED, REJECTED
    due_date DATE,
    submitted_date DATE,
    decided_date DATE,
    file_url TEXT,
    file_name VARCHAR(255)
);

-- 6. 리스크 테이블 (추가됨)
CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, MITIGATING, CLOSED
    title JSONB NOT NULL,
    owner VARCHAR(100),
    cause JSONB,
    action JSONB,
    expected_impact JSONB,
    target_date DATE
);

-- 7. WBS 태스크 테이블 (기존 tasks에서 세분화)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    wbs_code VARCHAR(50) NOT NULL,
    depth INT DEFAULT 0,
    name JSONB NOT NULL,
    weight NUMERIC(5, 2) DEFAULT 0,
    progress_pct NUMERIC(5, 2) DEFAULT 0,
    baseline_start DATE,
    baseline_end DATE,
    actual_start DATE,
    actual_end DATE
);
