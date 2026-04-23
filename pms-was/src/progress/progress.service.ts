import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { differenceInDays } from 'date-fns';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  /**
   * 프로젝트 총 진척률 계산 및 업데이트
   */
  async updateProjectTotalProgress(projectId: string) {
    const phases = await this.prisma.phase.findMany({
      where: { projectId },
    });

    const totalProgress = phases.reduce((sum, phase) => {
      return sum + (Number(phase.progressRate) * Number(phase.weight) / 100);
    }, 0);

    return this.prisma.project.update({
      where: { id: projectId },
      data: { totalProgress: parseFloat(totalProgress.toFixed(2)) },
    });
  }

  /**
   * 테스크별 진척률 유효성 검사 및 자동 산정
   */
  async calculateTaskProgress(taskId: string, inputProgress?: number): Promise<number> {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return 0;

    // 1. 사업관리 - 마일스톤 (0 또는 100만 허용)
    if (task.category === 'MILESTONE') {
      return inputProgress >= 100 ? 100 : 0;
    }

    // 2. 사업관리 - 정기보고 (날짜 기준 자동 산정)
    if (task.category === 'PERIODIC') {
      const now = new Date();
      const totalDays = differenceInDays(task.endDate, task.startDate);
      const elapsedDays = differenceInDays(now, task.startDate);
      const calculated = (elapsedDays / totalDays) * 100;
      return Math.min(100, Math.max(0, parseFloat(calculated.toFixed(2))));
    }

    return inputProgress ?? task.progressRate;
  }

  /**
   * 단계별 평균 진척률 업데이트 (분석/설계, 개발 등)
   */
  async updatePhaseProgress(phaseId: number) {
    const tasks = await this.prisma.task.findMany({
      where: { phaseId },
    });

    if (tasks.length === 0) return 0;

    // 분석/설계의 경우 필수 산출물 대상만 평균 산출할 수도 있음
    const avgProgress = tasks.reduce((sum, t) => sum + Number(t.progressRate), 0) / tasks.length;
    
    return this.prisma.phase.update({
      where: { id: phaseId },
      data: { progressRate: parseFloat(avgProgress.toFixed(2)) },
    });
  }
}
