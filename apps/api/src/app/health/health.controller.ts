import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/User';
import { HealthEndpointResponse } from '@erp/api-contracts';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private mem: MemoryHealthIndicator,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthEndpointResponse> {
    return {
      health: await this.health.check([
        () => this.db.pingCheck('database'),
        () => this.mem.checkHeap('memory_heap', 300 * 1024 * 1024)
      ]),
      usersCount: await this.usersRepository.count(),
    };
  }
}
