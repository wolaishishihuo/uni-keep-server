import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('健康检查模块')
@Controller('health')
export default class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) {}

  @ApiOperation({ summary: '健康检查' })
  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([() => ({ info: { status: 'up', message: 'Everything is fine' } })]);
  }

  @ApiOperation({ summary: '内存检查' })
  @Get('memory')
  @HealthCheck()
  checkMemory(): Promise<HealthCheckResult> {
    /**
     * @description The process should not use more than 1400MB memory
     * The health check will return an object like this:
     * {
     *  status: "ok",
     *  info: {
     *    memory_heap: {
     *      status: "up"
     *    }
     *  },
     * error: { },
     *   details: {
     *    memory_heap: {
     *     status: "up"
     *    }
     *   }
     * }
     */
    return this.health.check([() => this.memory.checkHeap('memory_heap', 1400 * 1024 * 1024)]);
  }

  @ApiOperation({ summary: '磁盘检查' })
  @Get('disk')
  @HealthCheck()
  checkDisk(): Promise<HealthCheckResult> {
    /**
     * @description The process should not use more than 80% disk storage
     * The health check will return an object like this:
     * {
     *  status: "ok",
     *  info: {
     *    storage: {
     *      status: "up"
     *    }
     *  },
     * error: { },
     *   details: {
     *    storage: {
     *     status: "up"
     *    }
     *   }
     * }
     */
    return this.health.check([() => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.8 })]);
  }
}
