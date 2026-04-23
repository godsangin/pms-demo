import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { PrismaService } from '../prisma/prisma.service';

@Controller('tasks')
export class TasksController {
  constructor(private prisma: PrismaService) {}

  @Get('export/csv/:phaseId')
  async exportCsv(@Param('phaseId') phaseId: string, @Res() res: Response) {
    const tasks = await this.prisma.task.findMany({
      where: { phaseId: parseInt(phaseId) },
      include: { manager: true }
    });

    // 데이터 가공
    const csvData = tasks.map(t => ({
      '테스크명': t.name,
      '카테고리': t.category,
      '수행기관': t.orgName,
      '담당자': t.manager?.fullName || '미지정',
      '진척률': `${t.progressRate}%`,
      '상태': t.status,
      '시작일': t.startDate,
      '종료일': t.endDate
    }));

    const fields = ['테스크명', '카테고리', '수행기관', '담당자', '진척률', '상태', '시작일', '종료일'];
    const json2csvParser = new Parser({ fields, withBOM: true });
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment(`tasks_phase_${phaseId}.csv`);
    return res.send(csv);
  }
}
