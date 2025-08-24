import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor() {}

  @Get()
  check() {
    this.logger.log('Health check called');
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}
