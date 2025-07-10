import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { FastingService } from './fasting.service';
import { CreateFastingDto } from './dto/create-fasting.dto';
import { JwtAuthGuard } from '@src/common/guards/jwtAuth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('断食计划')
@UseGuards(JwtAuthGuard)
@Controller('fasting')
export class FastingController {
  constructor(private readonly fastingService: FastingService) {}

  @Post('create')
  @ApiOperation({ summary: '创建断食计划' })
  @ApiResponse({ status: 200, description: '断食计划创建成功' })
  create(@Body() createFastingDto: CreateFastingDto) {
    return this.fastingService.create(createFastingDto);
  }

  @Get('plan/list')
  @ApiOperation({ summary: '获取断食计划列表' })
  @ApiResponse({ status: 200, description: '获取断食计划列表成功' })
  findAll(@Query() query: { userId: string }) {
    return this.fastingService.findAll(query.userId);
  }

  @Get('plan/active')
  @ApiOperation({ summary: '获取当前活跃的断食计划' })
  @ApiResponse({ status: 200, description: '获取活跃断食计划成功' })
  getActivePlan(@Query() query: { userId: string }) {
    return this.fastingService.getActivePlan(query.userId);
  }
}
