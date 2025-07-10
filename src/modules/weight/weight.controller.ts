import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WeightService } from './weight.service';
import { CreateWeightRecordDto } from './dto/createWeightRecord.dto';
import { JwtAuthGuard } from '@src/common/guards/jwtAuth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@src/common/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('体重记录')
@UseGuards(JwtAuthGuard)
@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post('create')
  @ApiOperation({ summary: '创建体重记录' })
  @ApiResponse({ status: 200, description: '体重记录创建成功' })
  async createWeightRecord(@Body() createWeightRecordDto: CreateWeightRecordDto) {
    return this.weightService.createWeightRecord(createWeightRecordDto);
  }

  @Get('get')
  @ApiOperation({ summary: '获取体重记录' })
  @ApiResponse({ status: 200, description: '体重记录获取成功' })
  async getWeightRecord(@Query() query: { userId: string }) {
    return this.weightService.getWeightRecord(query);
  }

  @Get('trendAnalysis')
  @ApiOperation({ summary: '体重趋势分析' })
  @ApiResponse({ status: 200, description: '体重趋势分析成功' })
  async getWeightTrendAnalysis(@User('id') userId: string) {
    return this.weightService.getWeightTrendAnalysis(userId);
  }
}
