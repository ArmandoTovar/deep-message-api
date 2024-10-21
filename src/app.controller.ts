import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStarted(): string {
    return this.appService.getStarted();
  }
  @Get('health')
  getHealthCheck(): { status: string } {
    return this.appService.getHealthCheck();
  }
}
