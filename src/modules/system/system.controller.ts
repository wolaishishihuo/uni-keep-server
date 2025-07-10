import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { UpdateSystemDto } from './dto/update-system.dto';
import { JwtAuthGuard } from '@src/common/guards/jwtAuth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('系统配置')
@UseGuards(JwtAuthGuard)
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @ApiOperation({ summary: '查询系统配置' })
  @ApiResponse({ status: 200, description: '查询系统配置' })
  @Get('list')
  findAll() {
    return this.systemService.findAll();
  }

  @Post('update')
  @ApiOperation({ summary: '更新系统配置' })
  @ApiResponse({ status: 200, description: '更新系统配置' })
  update(@Body() updateSystemDto: UpdateSystemDto) {
    return this.systemService.update(updateSystemDto);
  }
}
