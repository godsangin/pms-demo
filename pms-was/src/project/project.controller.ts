import { Controller, Get, Post, Patch, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.projectService.getProjectDetail(id);
  }

  @Get(':id/tasks')
  async getTasks(@Param('id') id: string) {
    return this.projectService.getProjectTasks(id);
  }

  @Get(':id/defects')
  async getDefects(@Param('id') id: string) {
    return this.projectService.getProjectDefects(id);
  }

  @Get(':id/progress')
  async getProgress(@Param('id') id: string) {
    return this.projectService.getProjectProgress(id);
  }

  @Get(':id/deliverables')
  async getDeliverables(@Param('id') id: string) {
    return this.projectService.getProjectDeliverables(id);
  }

  // 신규 산출물 등록
  @Post(':id/deliverables')
  async createDeliverable(@Param('id') projectId: string, @Body() data: any) {
    return this.projectService.createDeliverable(projectId, data);
  }

  // 산출물 파일 업로드
  @Post(':id/deliverables/:deliverableId/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/deliverables',
      filename: (_req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `\${randomName}\${extname(file.originalname)}`);
      }
    })
  }))
  async uploadDeliverableFile(
    @Param('id') _projectId: string,
    @Param('deliverableId') deliverableId: string,
    @UploadedFile() file: any
  ) {
    return this.projectService.updateDeliverableFile(deliverableId, {
      file_path: file.path,
      original_name: file.originalname
    });
  }

  // 테스크(프로그램/시나리오) 상태 및 진척률 업데이트
  @Patch(':id/tasks/:taskId')
  async updateTask(
    @Param('id') _projectId: string,
    @Param('taskId') taskId: string,
    @Body() updates: any,
  ) {
    return this.projectService.updateTask(taskId, updates);
  }

  // 신규 테스크 등록
  @Post(':id/tasks')
  async createTask(
    @Param('id') projectId: string,
    @Body() data: any,
  ) {
    return this.projectService.createTask(projectId, data);
  }

  // 테스크 일괄 등록
  @Post(':id/tasks/bulk')
  async registerTasksBulk(
    @Param('id') projectId: string,
    @Body() data: { programs?: any[], tasks?: any[] },
  ) {
    const list = data.programs || data.tasks || [];
    return this.projectService.registerTasksBulk(projectId, list);
  }

  // 산출물 일괄 등록
  @Post(':id/deliverables/bulk')
  async registerDeliverablesBulk(
    @Param('id') projectId: string,
    @Body() data: { deliverables: any[] },
  ) {
    return this.projectService.registerDeliverablesBulk(projectId, data.deliverables);
  }
}
