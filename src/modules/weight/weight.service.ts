import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateWeightRecordDto } from './dto/createWeightRecord.dto';

@Injectable()
export class WeightService {
  constructor(@Inject('PrismaClient') private prisma: PrismaClient) {}

  async createWeightRecord(createWeightRecordDto: CreateWeightRecordDto) {
    return this.prisma.weightRecord.create({
      data: createWeightRecordDto
    });
  }
}
