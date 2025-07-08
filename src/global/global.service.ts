import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  private prisma;
  private es;
  private kafka;
  private kafkaGroupId;
  private redis;

  getPrisma() {
    return this.prisma;
  }

  setPrisma(prisma) {
    this.prisma = prisma;
  }

  getEs() {
    return this.es;
  }

  setEs(es) {
    this.es = es;
  }

  setKafka(kafka, groupId) {
    this.kafka = kafka;
    this.kafkaGroupId = groupId;
  }

  getKafka() {
    return { kafka: this.kafka, groupId: this.kafkaGroupId };
  }

  setRedis(redis) {
    this.redis = redis;
  }

  getRedis() {
    return this.redis;
  }
}
