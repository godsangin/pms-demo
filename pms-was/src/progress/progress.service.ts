import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  /**
   * 프로젝트 전체 진척률 재계산 (가중치 기반)
   * 정책: Σ(단계별 진척률 * 단계별 가중치 / 100)
   */
  async recalculateProjectTotalProgress(projectId: string) {
    // 1. 각 단계별 진척률 먼저 업데이트
    const phases = await this.prisma.phase.findMany({ where: { project_id: projectId } });
    
    for (const phase of phases) {
      await this.updateSpecificPhaseProgress(phase.id, phase.phase_type);
    }

    // 2. 업데이트된 단계별 데이터 다시 조회
    const updatedPhases = await this.prisma.phase.findMany({ where: { project_id: projectId } });

    // 3. 가중치 합산 계산
    const totalProgress = updatedPhases.reduce((sum, phase) => {
      const weight = Number(phase.weight || 0);
      const rate = Number(phase.progress_rate || 0);
      return sum + (rate * weight / 100);
    }, 0);

    // 4. 프로젝트 테이블 업데이트
    return this.prisma.project.update({
      where: { id: projectId },
      data: { total_progress: parseFloat(totalProgress.toFixed(2)) },
    });
  }

  /**
   * 단계별 특화 진척률 산정 로직
   */
  private async updateSpecificPhaseProgress(phaseId: number, type: string) {
    let progressRate = 0;

    switch (type) {
      case 'ANALYSIS': // 30% - 산출물 기반
        progressRate = await this.calculateDeliverableBasedProgress(phaseId);
        break;
      
      case 'DEVELOPMENT': // 40% - 프로그램 목록 기반
        progressRate = await this.calculateProgramBasedProgress(phaseId);
        break;

      case 'TEST': // 15% - 테스트 시나리오/통테 기반
        progressRate = await this.calculateTestBasedProgress(phaseId);
        break;

      default: // MANAGEMENT(10%), TRANSITION(5%) - 일반 테스크 평균
        progressRate = await this.calculateTaskAverageProgress(phaseId);
        break;
    }

    return this.prisma.phase.update({
      where: { id: phaseId },
      data: { progress_rate: parseFloat(progressRate.toFixed(2)) },
    });
  }

  // 분석/설계: 필수 산출물 승인 완료 기준
  private async calculateDeliverableBasedProgress(phaseId: number): Promise<number> {
    const tasks = await this.prisma.task.findMany({
      where: { phase_id: phaseId, is_required_deliverable: true }
    });
    if (tasks.length === 0) return 0;
    
    // 필수 산출물 테스크 중 'COMPLETED' 또는 'DONE'인 비율
    const completed = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
    return (completed / tasks.length) * 100;
  }

  // 개발: 프로그램 목록의 개별 진척률 평균
  private async calculateProgramBasedProgress(phaseId: number): Promise<number> {
    const programs = await this.prisma.task.findMany({
      where: { phase_id: phaseId, category: 'PROGRAM' }
    });
    if (programs.length === 0) return 0;

    const sum = programs.reduce((acc, p) => acc + Number(p.progress_rate || 0), 0);
    return sum / programs.length;
  }

  // 테스트: 테스트 시나리오 성공 비율
  private async calculateTestBasedProgress(phaseId: number): Promise<number> {
    const scenarios = await this.prisma.task.findMany({
      where: { phase_id: phaseId, category: 'SCENARIO' }
    });
    if (scenarios.length === 0) return 0;

    // 성공(PASS)으로 표시된 시나리오 비율
    const passed = scenarios.filter(s => s.test_result === 'PASS').length;
    return (passed / scenarios.length) * 100;
  }

  // 일반: 테스크 진척률 산술 평균
  private async calculateTaskAverageProgress(phaseId: number): Promise<number> {
    const tasks = await this.prisma.task.findMany({ where: { phase_id: phaseId } });
    if (tasks.length === 0) return 0;
    const sum = tasks.reduce((acc, t) => acc + Number(t.progress_rate || 0), 0);
    return sum / tasks.length;
  }
}
