import { Controller, Get } from '@nestjs/common';
import { HealthCheckOutputDto, HealthStatus } from './health.dto';

@Controller('health')
export class HealthController {
  @Get()
  healthCheck(): HealthCheckOutputDto {
    return { status: HealthStatus.OK };
  }
}
