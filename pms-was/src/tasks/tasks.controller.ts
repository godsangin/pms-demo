import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private prisma: PrismaService) {}

  @Get('export/csv/:phaseId')
  async exportCsv(@Param('phaseId') phaseId: string, @Res() res: Response) {
    const tasks = await this.prisma.task.findMany({
      where: { phase_id: parseInt(phaseId) },
      include: { manager: true },
      orderBy: { wbs_code: 'asc' }
    });

    // 데이터 가공 (프론트엔드 WBS 구조와 일치하도록 필드 확장)
    const csvData = tasks.map(t => ({
      'WBS': t.wbs_code || '',
      '테스크명': t.name,
      '카테고리': t.category,
      '수행기관': t.org_name || '',
      '담당자': t.manager?.full_name || '미지정',
      '가중치': Number(t.weight).toFixed(4),
      '진척률': `${Number(t.progress_rate)}%`,
      '상태': t.status,
      '계획시작일': t.baseline_start || '',
      '계획종료일': t.baseline_end || '',
      '실제시작일': t.actual_start || '',
      '실제종료일': t.actual_end || ''
    }));

    const fields = [
      'WBS', '테스크명', '카테고리', '수행기관', '담당자', 
      '가중치', '진척률', '상태', 
      '계획시작일', '계획종료일', '실제시작일', '실제종료일'
    ];
    
    const json2csvParser = new Parser({ fields, withBOM: true });
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment(`WBS_Export_Phase_${phaseId}.csv`);
    return res.send(csv);
  }
}
