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

-- 1. 사용자 및 권한
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
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
    total_progress DECIMAL(5, 2) DEFAULT 0.00, -- Σ(Phase_Progress * Phase_Weight / 100)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 프로젝트 5단계 (사업관리, 분석/설계, 개발/테스트, 통합테스트, 이행)
CREATE TABLE phases (
    id SERIAL PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    phase_type VARCHAR(50) NOT NULL, -- MANAGEMENT, ANALYSIS, DEVELOPMENT, INTEGRATION, TRANSITION
    name VARCHAR(100) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL, -- 가중치 (10, 30, 40, 15, 5)
    progress_rate DECIMAL(5, 2) DEFAULT 0.00,
    sort_order INT NOT NULL,
    UNIQUE(project_id, phase_type)
);

-- 3. 테스크 (카테고리별 진척 산정 로직 적용 대상)
CREATE TYPE task_category AS ENUM ('MILESTONE', 'PERIODIC', 'DELIVERABLE', 'PROGRAM', 'SCENARIO', 'COMMON');
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id INT REFERENCES phases(id) ON DELETE CASCADE,
    category task_category NOT NULL DEFAULT 'COMMON',
    name VARCHAR(255) NOT NULL,
    org_name VARCHAR(100),
    manager_id UUID REFERENCES users(id),
    progress_rate DECIMAL(5, 2) DEFAULT 0.00,
    is_required_deliverable BOOLEAN DEFAULT FALSE, -- 분석/설계 단계 테일러링 기준
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'READY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 산출물
CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255),
    file_path TEXT,
    link_url TEXT,
    author_id UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 결함 (단위/통합테스트 단계 연동)
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
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_defects_status ON defects(status);
