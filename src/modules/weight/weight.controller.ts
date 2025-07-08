import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WeightService } from './weight.service';
import { CreateWeightRecordDto } from './dto/createWeightRecord.dto';
import { JwtAuthGuard } from '@src/common/guards/jwtAuth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: '创建体重记录' })
  @ApiResponse({ status: 200, description: '体重记录创建成功' })
  async createWeightRecord(@Body() createWeightRecordDto: CreateWeightRecordDto) {
    return this.weightService.createWeightRecord(createWeightRecordDto);
  }
}
