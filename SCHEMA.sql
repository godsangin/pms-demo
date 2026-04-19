-- PostgreSQL 초기 스키마 설정 (Software PMS)
-- # 터미널에서 실행 시 psql -U postgres -d pms -f SCHEMA.sql

-- 1. UUID 확장 모듈 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 프로젝트 테이블 (기본 정보)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PLANNING',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 소프트웨어 특화 정보 테이블 (Project와 1:1)
CREATE TABLE IF NOT EXISTS software_projects (
    project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    tech_stack TEXT[], -- 문자열 배열 (e.g., {'React', 'NestJS'})
    git_repo_url VARCHAR(255),
    architecture_type VARCHAR(100),
    ci_cd_status VARCHAR(50) DEFAULT 'STABLE'
);

-- 4. SDLC 단계 테이블 (Project와 1:N)
CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 분석, 설계, 구현, 테스트 등
    "order" INT NOT NULL,       -- 단계 순서
    status VARCHAR(50) DEFAULT 'NOT_STARTED',
    progress NUMERIC(5, 2) DEFAULT 0.00, -- 진행률 (0~100)
    UNIQUE(project_id, "order") -- 동일 프로젝트 내 순서 중복 방지
);

-- 5. 산출물 테이블 (Stage와 1:N)
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- DOC, CODE, IMAGE 등
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING'
);

-- 6. 테스트 현황 테이블 (Project와 1:1)
CREATE TABLE IF NOT EXISTS test_summaries (
    project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    total_cases INT DEFAULT 0,
    passed_cases INT DEFAULT 0,
    failed_cases INT DEFAULT 0,
    defect_rate NUMERIC(5, 2) GENERATED ALWAYS AS (
        CASE WHEN total_cases > 0 THEN (failed_cases::numeric / total_cases::numeric) * 100 ELSE 0 END
    ) STORED,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. 투입 인력 테이블 (Project와 N:M 관계의 중간 테이블)
CREATE TABLE IF NOT EXISTS project_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    role VARCHAR(50), -- PM, Dev, QA, BA 등
    effort_mm NUMERIC(3, 1), -- 투입 공수 (M/M)
    joined_at DATE DEFAULT CURRENT_DATE
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_stages_project_id ON stages(project_id);
CREATE INDEX idx_deliverables_stage_id ON deliverables(stage_id);
