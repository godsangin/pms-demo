import { Controller, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('dashboard')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get()
  async getDashboard() {
    return this.portfolioService.getDashboardData();
  }
}
