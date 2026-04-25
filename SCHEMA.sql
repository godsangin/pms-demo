-- PMS(Project Management System) Core Schema
-- Database: PostgreSQL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 기존 테이블 삭제
DROP TABLE IF EXISTS defects CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS phases CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS task_category CASCADE;
DROP TYPE IF EXISTS defect_status CASCADE;
DROP TYPE IF EXISTS deliverable_status CASCADE;
DROP TYPE IF EXISTS delivery_stage CASCADE;

-- 1. 사용자 및 권한
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'EXEC');
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    org_name VARCHAR(100),
    role user_role DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 프로젝트 및 단계
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pm_id UUID REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'GREEN',
    total_progress DECIMAL(5, 2) DEFAULT 0.00,
    sv_this_week DECIMAL(5, 2) DEFAULT 0.00,
    high_risk_count INT DEFAULT 0,
    deliverable_approval_rate DECIMAL(5, 2) DEFAULT 0.00,
    critical_task_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 프로젝트 단계 (사업관리, 분석/설계, 개발, 테스트, 이행 등)
CREATE TABLE phases (
    id SERIAL PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    phase_type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    progress_rate DECIMAL(5, 2) DEFAULT 0.00,
    sort_order INT NOT NULL,
    UNIQUE(project_id, phase_type)
);

-- 3. 테스크 (WBS 구조 포함)
CREATE TYPE task_category AS ENUM ('MILESTONE', 'PERIODIC', 'DELIVERABLE', 'PROGRAM', 'SCENARIO', 'COMMON');
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id INT REFERENCES phases(id) ON DELETE CASCADE,
    category task_category NOT NULL DEFAULT 'COMMON',
    name VARCHAR(255) NOT NULL,
    org_name VARCHAR(100),
    manager_id UUID REFERENCES users(id),
    progress_rate DECIMAL(5, 2) DEFAULT 0.00,
    is_required_deliverable BOOLEAN DEFAULT FALSE,
    
    -- WBS 및 일정 필드 추가
    wbs_code VARCHAR(50),
    depth INT DEFAULT 0,
    weight DECIMAL(5, 4) DEFAULT 0.0000, -- WBS 내 가중치
    baseline_start DATE,
    baseline_end DATE,
    actual_start DATE,
    actual_end DATE,
    
    start_date DATE, -- 현재 진행 기간 (actual_start와 유사하나 별도 관리 가능)
    end_date DATE,
    status VARCHAR(20) DEFAULT 'READY',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 산출물
CREATE TYPE deliverable_status AS ENUM ('PLANNED', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'NOT_SUBMITTED');
CREATE TYPE delivery_stage AS ENUM ('ANALYSIS_DESIGN', 'DEVELOPMENT', 'TEST', 'DEPLOYMENT');

CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    status deliverable_status DEFAULT 'PLANNED',
    due_date DATE,
    submitted_date DATE,
    decided_date DATE,
    stage delivery_stage,
    file_path TEXT,
    link_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 결함
CREATE TYPE defect_status AS ENUM ('조치예정', '조치 중', '조치완료');
CREATE TABLE defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status defect_status DEFAULT '조치예정',
    severity VARCHAR(20),
    reporter_id UUID REFERENCES users(id),
    assignee_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_tasks_wbs ON tasks(wbs_code);
CREATE INDEX idx_tasks_project ON tasks(phase_id);
CREATE INDEX idx_deliverables_project ON deliverables(project_id);
