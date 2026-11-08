import { Controller, Get } from '@nestjs/common';
import { VERSION } from '../../version.js';

@Controller('health')
export class HealthController {
  @Get()
  onHealthCheck() {
    return {
      status: 'OK',
      version: VERSION,
    };
  }
}
