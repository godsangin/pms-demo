import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';
import { excelSerialToDate } from '../shared/utils/excel-date';
import { parse } from 'csv-parse/sync';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private progressService: ProgressService
  ) {}

  async getProjectDetail(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { pm: true },
    });

    if (!project) throw new NotFoundException(`Project not found`);

    const phases = await this.prisma.phase.findMany({
      where: { project_id: projectId },
      orderBy: { sort_order: 'asc' },
    });

    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        pmName: project.pm?.full_name || '미지정',
        startDate: project.start_date,
        endDate: project.end_date,
        status: project.status,
        totalProgress: Number(project.total_progress || 0),
        svThisWeek: Number(project.sv_this_week || 0),
        deliverableApprovalRate: Number(project.deliverable_approval_rate || 0),
        highRiskCount: project.high_risk_count || 0,
        nextMilestone: { name: '프로토타입 시연', date: '2026-05-15' },
      },
      risks: [],
      phases: phases.map(p => ({
        id: p.id,
        type: p.phase_type,
        name: p.name,
        weight: Number(p.weight),
        progressRate: Number(p.progress_rate || 0),
      })),
    };
  }

  async getProjectTasks(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { phase: { project_id: projectId } },
      orderBy: { wbs_code: 'asc' },
    });

    return tasks.map(t => ({
      id: t.id,
      projectId: projectId,
      phaseId: t.phase_id,
      category: t.category,
      name: t.name,
      title: t.name, // TestScenario.title 호환
      orgName: t.org_name || '',
      owner: t.org_name || '', // TestScenario.owner 호환
      managerId: t.manager_id || '',
      progressPct: Number(t.progress_rate || 0),
      isRequiredDeliverable: t.is_required_deliverable,
      startDate: t.start_date,
      endDate: t.end_date,
      status: t.status,
      wbsCode: t.wbs_code,
      depth: t.depth,
      weight: Number(t.weight || 0),
      baselineStart: t.baseline_start,
      baselineEnd: t.baseline_end,
      actualStart: t.actual_start,
      actualEnd: t.actual_end,
      executedDate: t.actual_end, // TestScenario.executedDate 호환
      // 테스트 필드
      testType: (t as any).test_type,
      type: (t as any).test_type, 
      testResult: (t as any).test_result,
      result: (t as any).test_result, 
      evidenceNote: (t as any).evidence_note,
      intakeStatus: (t as any).intake_status,
      programId: (t as any).program_id,
    }));
  }

  // 결함 현황 조회
  async getProjectDefects(projectId: string) {
    const defects = await this.prisma.defect.findMany({
      where: { task: { phase: { project_id: projectId } } },
      include: {
        task: true,
        reporter: true,
        assignee: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return defects.map(d => ({
      id: d.id,
      taskId: d.task_id,
      taskName: d.task.name,
      title: d.title,
      description: d.description,
      status: d.status,
      severity: d.severity,
      reporterName: d.reporter?.full_name || '익명',
      assigneeName: d.assignee?.full_name || '미지정',
      createdAt: d.created_at,
    }));
  }

  // 테스크 업데이트 및 진척률 재산정
  async updateTask(taskId: string, updates: any) {
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        name: updates.name,
        wbs_code: updates.code,
        org_name: updates.owner,
        status: updates.status,
        progress_rate: updates.progressPct,
        baseline_start: updates.baselineStart ? new Date(updates.baselineStart) : undefined,
        baseline_end: updates.baselineEnd ? new Date(updates.baselineEnd) : undefined,
        actual_start: updates.actualStart ? new Date(updates.actualStart) : undefined,
        actual_end: updates.actualEnd ? new Date(updates.actualEnd) : undefined,
        // 테스트 필드 업데이트
        test_type: updates.type,
        test_result: updates.result,
        evidence_note: updates.evidenceNote,
        intake_status: updates.intakeStatus,
        program_id: updates.programId,
      } as any,
      include: { phase: true }
    });

    // 테스크 업데이트 후 단계별/프로젝트별 진척률 실시간 재계산
    const updatedTask = task as any;
    await this.progressService.recalculateProjectTotalProgress(updatedTask.phase.project_id);

    return task;
  }

  // 신규 테스크 등록
  async createTask(projectId: string, data: any) {
    // 1. 단계(Phase) 결정 로직
    const targetPhaseType = data.category === 'SCENARIO' ? 'TEST' : 'DEVELOPMENT';
    
    let phase = await this.prisma.phase.findFirst({
      where: { project_id: projectId, phase_type: targetPhaseType }
    });

    if (!phase) {
      phase = await this.prisma.phase.findFirst({
        where: { project_id: projectId },
        orderBy: { sort_order: 'asc' }
      });
    }

    if (!phase) throw new NotFoundException('Phase not found for this project');

    const task = await this.prisma.task.create({
      data: {
        phase_id: phase.id,
        category: data.category || 'PROGRAM',
        name: data.name || data.title, // 시나리오는 title로 올 수 있음
        wbs_code: data.code,
        org_name: data.owner,
        status: data.status || 'READY',
        progress_rate: data.progressPct || 0,
        baseline_start: data.baselineStart ? new Date(data.baselineStart) : undefined,
        baseline_end: data.baselineEnd ? new Date(data.baselineEnd) : undefined,
        actual_start: data.actualStart ? new Date(data.actualStart) : undefined,
        actual_end: data.actualEnd ? new Date(data.actualEnd) : undefined,
        // 테스트 필드
        test_type: data.type,
        test_result: data.result || 'NA',
        evidence_note: data.evidenceNote,
        intake_status: data.intakeStatus || 'PENDING',
        program_id: data.programId,
      } as any,
      include: { phase: true }
    });

    // 진척률 재계산
    await this.progressService.recalculateProjectTotalProgress(projectId);

    return task;
  }

  // 신규 산출물 등록
  async createDeliverable(projectId: string, data: any) {
    const item = await this.prisma.deliverable.create({
      data: {
        project_id: projectId,
        title: data.title,
        status: data.status || 'PLANNED',
        progress_rate: data.progressPct ? Number(data.progressPct) : 0,
        due_date: data.dueDate ? new Date(data.dueDate) : undefined,
        stage: data.stage,
        task_id: data.taskId,
      }
    });

    // 승인율 재계산
    await this.recalculateApprovalRate(projectId);
    
    return item;
  }

  // 산출물 업데이트 (진척률 등)
  async updateDeliverable(deliverableId: string, updates: any) {
    const item = await this.prisma.deliverable.update({
      where: { id: deliverableId },
      data: {
        title: updates.title,
        status: updates.status,
        progress_rate: updates.progressPct !== undefined ? Number(updates.progressPct) : undefined,
        due_date: updates.dueDate ? new Date(updates.dueDate) : undefined,
        stage: updates.stage,
      } as any,
    });

    // 승인율 재계산
    await this.recalculateApprovalRate(item.project_id);

    return item;
  }

  // 산출물 파일 업로드 및 상태 업데이트
  async updateDeliverableFile(deliverableId: string, info: { file_path: string, original_name: string }) {
    const deliverable = await this.prisma.deliverable.update({
      where: { id: deliverableId },
      data: {
        file_path: info.file_path,
        status: 'SUBMITTED',
        submitted_date: new Date(),
      }
    });

    // 승인율 재계산
    await this.recalculateApprovalRate(deliverable.project_id);

    return deliverable;
  }

  // 테스크 일괄 등록
  async registerTasksBulk(projectId: string, list: any[]) {
    // 1. 단계(Phase) 결정 로직
    let devPhase = await this.prisma.phase.findFirst({
      where: { project_id: projectId, phase_type: 'DEVELOPMENT' }
    });
    if (!devPhase) {
      devPhase = await this.prisma.phase.findFirst({
        where: { project_id: projectId },
        orderBy: { sort_order: 'asc' }
      });
    }

    const tasksData = list.map(item => ({
      phase_id: devPhase.id,
      category: item.category || 'PROGRAM',
      name: item.name || item.title,
      wbs_code: item.code,
      org_name: item.owner,
      status: item.status || 'READY',
      progress_rate: item.progressPct || 0,
      baseline_start: item.baselineStart ? new Date(item.baselineStart) : undefined,
      baseline_end: item.baselineEnd ? new Date(item.baselineEnd) : undefined,
      actual_start: item.actualStart ? new Date(item.actualStart) : undefined,
      actual_end: item.actualEnd ? new Date(item.actualEnd) : undefined,
    }));

    const result = await this.prisma.task.createMany({
      data: tasksData
    });

    // 진척률 재계산
    await this.progressService.recalculateProjectTotalProgress(projectId);

    return { registeredCount: result.count };
  }

  // 산출물 일괄 등록
  async registerDeliverablesBulk(projectId: string, list: any[]) {
    const deliverablesData = list.map(item => ({
      project_id: projectId,
      title: item.title,
      status: item.status || 'PLANNED',
      due_date: item.dueDate ? new Date(item.dueDate) : undefined,
      stage: item.stage,
    }));

    const result = await this.prisma.deliverable.createMany({
      data: deliverablesData
    });

    // 승인율 재계산
    await this.recalculateApprovalRate(projectId);

    return { registeredCount: result.count };
  }

  // 산출물 승인율 재계산 로직
  private async recalculateApprovalRate(projectId: string) {
    const total = await this.prisma.deliverable.count({ where: { project_id: projectId } });
    if (total === 0) return;

    const accepted = await this.prisma.deliverable.count({ 
      where: { project_id: projectId, status: 'ACCEPTED' } 
    });

    const rate = (accepted / total) * 100;

    await this.prisma.project.update({
      where: { id: projectId },
      data: { deliverable_approval_rate: rate }
    });
  }

  async getProjectProgress(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });

    const currentActual = Number(project?.total_progress || 0);
    
    // 임시: 현재 진척률을 기준으로 과거 3주간의 추세를 생성하여 반환 (실제로는 스냅샷 테이블 필요)
    return [
      { week: '2026-W15', planned: 20, actual: Math.max(0, currentActual - 15) },
      { week: '2026-W16', planned: 35, actual: Math.max(0, currentActual - 8) },
      { week: '2026-W17', planned: 50, actual: currentActual },
    ];
  }

  async getProjectDeliverables(projectId: string) {
    const items = await this.prisma.deliverable.findMany({
      where: { project_id: projectId },
      orderBy: { due_date: 'asc' },
    });

    return items.map(d => ({
      id: d.id,
      projectId: d.project_id,
      title: d.title,
      status: d.status,
      progressPct: Number(d.progress_rate || 0),
      dueDate: d.due_date,
      submittedDate: d.submitted_date,
      stage: d.stage,
      filePath: d.file_path,
    }));
  }

  async getDeliverableById(deliverableId: string) {
    return this.prisma.deliverable.findUnique({
      where: { id: deliverableId }
    });
  }

  // WBS CSV 파일 기반 데이터 임포트
  async importWbsFromCsv(projectId: string, csvContent: string) {
    const records = parse(csvContent, {
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true,
    });

    // 헤더 이후의 데이터 행만 처리 (7행부터 데이터 시작)
    const dataRows = records.slice(7);
    let updatedCount = 0;

    for (const row of dataRows) {
      const wbsCode = row[2]?.trim();
      if (!wbsCode) continue;

      const baselineStart = excelSerialToDate(row[12]);
      const baselineEnd = excelSerialToDate(row[13]);
      const actualStart = excelSerialToDate(row[18]);
      const actualEnd = excelSerialToDate(row[19]);
      
      // 진척률 (20.5% 와 같은 형식 처리)
      const progressRaw = row[20] || '0';
      const progressRate = parseFloat(progressRaw.replace('%', '')) || 0;

      // 해당 WBS 코드를 가진 테스크 찾기
      const task = await this.prisma.task.findFirst({
        where: { 
          wbs_code: wbsCode,
          phase: { project_id: projectId }
        }
      });

      if (task) {
        await this.prisma.task.update({
          where: { id: task.id },
          data: {
            baseline_start: baselineStart,
            baseline_end: baselineEnd,
            actual_start: actualStart,
            actual_end: actualEnd,
            progress_rate: progressRate,
            status: progressRate === 100 ? 'DONE' : progressRate > 0 ? 'IN_PROGRESS' : 'READY'
          }
        });
        updatedCount++;
      }
    }

    // 전체 진척률 재계산
    await this.progressService.recalculateProjectTotalProgress(projectId);

    return { updatedCount };
  }
}
