import { IsNotEmpty } from 'class-validator';

export class HealthCheckOutputDto {
  @IsNotEmpty()
  status: HealthStatus;
}

export enum HealthStatus {
  OK = 'OK',
}
