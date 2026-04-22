-- PMS(Project Management System) Core Schema
-- Database: PostgreSQL

-- UUID 확장을 사용하여 보안 및 분산 환경 대응
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 기존 테이블 삭제 (초기화)
DROP TABLE IF EXISTS defects CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS phases CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 1. 프로젝트 기본 정보
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    total_progress DECIMAL(5, 2) DEFAULT 0.00, -- 전체 가중치 합산 진척률
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 프로젝트 관리 5단계 (Phases)
-- 점유비(weight): 사업관리(10), 분석/설계(30), 개발/테스트(40), 통합테스트(15), 이행(5)
CREATE TABLE phases (
    id SERIAL PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase_type VARCHAR(50) NOT NULL, -- 'MANAGEMENT', 'ANALYSIS', 'DEVELOPMENT', 'INTEGRATION', 'TRANSITION'
    name VARCHAR(100) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL, -- 가중치 (예: 30.00)
    progress_rate DECIMAL(5, 2) DEFAULT 0.00, -- 단계별 진척률
    sort_order INT NOT NULL,
    UNIQUE(project_id, phase_type)
);

-- 3. 테스크 (Tasks)
-- 모든 단계의 하위 작업, 프로그램 목록, 테스트 시나리오 등을 통합 관리
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id INT NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    org_name VARCHAR(100),            -- 수행기관
    manager_name VARCHAR(100),        -- 담당자
    progress_rate DECIMAL(5, 2) DEFAULT 0.00,
    task_type VARCHAR(50),            -- 'REPORT', 'DELIVERABLE', 'PROGRAM', 'SCENARIO', 'MIGRATION'
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'READY',
    is_required_deliverable BOOLEAN DEFAULT FALSE, -- 필수 산출물 여부 (테일러링 기준)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 산출물 (Deliverables)
-- 파일 경로 또는 링크 정보를 저장
CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255),
    file_path TEXT,
    link_url TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 결함 (Defects)
-- 단위테스트 및 통합테스트 단계의 테스크(시나리오/프로그램)와 연관
CREATE TABLE defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT '조치예정', -- '조치예정', '조치 중', '조치완료'
    severity VARCHAR(20), -- 긴급, 보통, 낮음
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_defect_status CHECK (status IN ('조치예정', '조치 중', '조치완료'))
);

-- 인덱스 설정 (조회 성능 최적화)
CREATE INDEX idx_tasks_phase_id ON tasks(phase_id);
CREATE INDEX idx_defects_task_id ON defects(task_id);
CREATE INDEX idx_phases_project_id ON phases(project_id);

-- 트리거: updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_defects_modtime BEFORE UPDATE ON defects FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
