import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject('RedisClient') private readonly redis: Redis) {}

  // 设置缓存（带过期时间）
  async set(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }
    return this.redis.set(key, value);
  }

  // 获取缓存
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  // 设置JSON对象（自动序列化）
  async setJson(key: string, value: any, ttl?: number): Promise<string> {
    const jsonStr = JSON.stringify(value);
    return this.set(key, jsonStr, ttl);
  }

  // 获取JSON对象（自动反序列化）
  async getJson(key: string): Promise<any | null> {
    const jsonStr = await this.get(key);
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch (error) {
      this.logger.error(`JSON解析失败: ${key}`, error);
      return null;
    }
  }

  // 删除缓存
  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  // 检查key是否存在
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  // 获取剩余过期时间（秒）
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  // 设置过期时间
  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.redis.expire(key, ttl);
    return result === 1;
  }
}
