import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const projects = await this.prisma.project.findMany({
      include: { pm: true },
      orderBy: { created_at: 'desc' }
    });

    const totalProjects = projects.length;
    const inProgressProjects = projects.length; // 모든 프로젝트가 진행 중이라고 가정하거나 상태 필드 체크
    const onTrackCount = projects.filter(p => p.status === 'GREEN').length;
    const onTrackPercent = totalProjects > 0 ? (onTrackCount / totalProjects) * 100 : 0;
    const atRiskProjects = projects.filter(p => p.status !== 'GREEN').length;
    const criticalTasks = projects.reduce((sum, p) => sum + (p.critical_task_count || 0), 0);
    
    // 평균 승인율 계산
    const avgApprovalRate = totalProjects > 0 
      ? projects.reduce((sum, p) => sum + Number(p.deliverable_approval_rate || 0), 0) / totalProjects 
      : 0;

    // 평균 SV 계산
    const avgSv = totalProjects > 0
      ? projects.reduce((sum, p) => sum + Number(p.sv_this_week || 0), 0) / totalProjects
      : 0;

    return {
      asOfDate: new Date().toISOString().split('T')[0],
      kpis: {
        totalProjects,
        inProgressProjects,
        onTrackPercent,
        atRiskProjects,
        criticalTasks,
        deliverableApprovalRate: avgApprovalRate,
        portfolioSvAvg: avgSv,
      },
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        pmName: p.pm?.full_name || '미지정',
        startDate: p.start_date,
        endDate: p.end_date,
        status: p.status,
        totalProgress: Number(p.total_progress || 0),
        svThisWeek: Number(p.sv_this_week || 0),
        deliverableApprovalRate: Number(p.deliverable_approval_rate || 0),
        criticalTaskCount: p.critical_task_count || 0,
        nextMilestone: { name: '-', date: '-' } // 추가 로직 필요 시 구현
      })),
      topRisks: [] // 리스크 연동 필요 시 구현
    };
  }
}
