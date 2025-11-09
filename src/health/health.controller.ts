import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Check database connection
      () => this.db.pingCheck('database'),

      // Check memory heap doesn't exceed 150MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      // Check memory RSS doesn't exceed 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),

      // Check disk storage (90% threshold)
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @Get('live')
  @HealthCheck()
  liveness() {
    // Simple liveness check - is the service running?
    return this.health.check([
      () => Promise.resolve({ liveness: { status: 'up' } }),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    // Readiness check - is the service ready to accept traffic?
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
