import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { PortfolioController } from './portfolio/portfolio.controller';
import { ProjectController } from './project/project.controller';
import { ProgressService } from './progress/progress.service';
import { PortfolioService } from './portfolio/portfolio.service';
import { ProjectService } from './project/project.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TasksController, PortfolioController, ProjectController],
  providers: [ProgressService, PortfolioService, ProjectService, PrismaService],
})
export class AppModule {}
