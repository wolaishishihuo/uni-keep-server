import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { FastingRecordService } from './fasting-record.service';
import { CreateFastingRecordDto } from './dto/create-fasting-record.dto';
import { JwtAuthGuard } from '@src/common/guards/jwtAuth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFastingRecordDto } from './dto/update-fasting-record.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('断食记录')
@UseGuards(JwtAuthGuard)
@Controller('fastingRecord')
export class FastingRecordController {
  constructor(private readonly fastingRecordService: FastingRecordService) {}

  @Get('list')
  @ApiOperation({ summary: '获取断食记录' })
  @ApiResponse({ status: 200, description: '获取断食记录成功' })
  getRecord(@Query() query: { userId: string; planId: string }) {
    return this.fastingRecordService.getRecord(query);
  }

  @Get('getUnfinishedRecord')
  @ApiOperation({ summary: '获取尚未结束的断食记录' })
  @ApiResponse({ status: 200, description: '获取尚未结束的断食记录成功' })
  getUnfinishedRecord(@Query() query: { userId: string; planId: string }) {
    return this.fastingRecordService.getUnfinishedRecord(query);
  }

  @Post('create')
  @ApiOperation({ summary: '创建断食记录' })
  @ApiResponse({ status: 200, description: '创建断食记录成功' })
  createRecord(@Body() record: CreateFastingRecordDto) {
    return this.fastingRecordService.create(record);
  }

  @Post('update')
  @ApiOperation({ summary: '更新断食记录' })
  @ApiResponse({ status: 200, description: '更新断食记录成功' })
  updateRecord(@Body() record: UpdateFastingRecordDto) {
    return this.fastingRecordService.update(record);
  }

  // 根据Id获取断食记录
  @Get('getRecordById')
  @ApiOperation({ summary: '根据Id获取断食记录' })
  @ApiResponse({ status: 200, description: '根据Id获取断食记录成功' })
  getRecordById(@Query() query: { id: string }) {
    return this.fastingRecordService.getRecordById(query.id);
  }
}
