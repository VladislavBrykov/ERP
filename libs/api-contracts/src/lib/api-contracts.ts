import { HealthCheckResult } from '@nestjs/terminus';

export type HealthEndpointResponse = {
  health: HealthCheckResult,
  usersCount: number,
}
