import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  healthCheck(): void {
    // This method will return 200 OK without a body
  }
}
