import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStarted(): string {
    return 'Started!';
  }
  getHealthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
