import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { FastingRecordService } from './fasting-record.service';
import { CreateFastingRecordDto } from './dto/create-fasting-record.dto';
import { JwtAuthGuard } from '@src/common/guards/jwtAuth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFastingRecordDto } from './dto/update-fasting-record.dto';

@Controller('fastingRecord')
export class FastingRecordController {
  constructor(private readonly fastingRecordService: FastingRecordService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiOperation({ summary: '获取断食记录' })
  @ApiResponse({ status: 200, description: '获取断食记录成功' })
  getRecord(@Query() query: { userId: string; planId: string }) {
    return this.fastingRecordService.getRecord(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: '创建断食记录' })
  @ApiResponse({ status: 200, description: '创建断食记录成功' })
  createRecord(@Body() record: CreateFastingRecordDto) {
    return this.fastingRecordService.create(record);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  @ApiOperation({ summary: '更新断食记录' })
  @ApiResponse({ status: 200, description: '更新断食记录成功' })
  updateRecord(@Body() record: UpdateFastingRecordDto) {
    return this.fastingRecordService.update(record);
  }
}
