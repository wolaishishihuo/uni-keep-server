import Redis from 'ioredis';
import { Logger } from '@nestjs/common';
const connectLogger = new Logger('connectRedis');

// 动态连接
export const connectRedis = async (nodes, logger = connectLogger, cb = null) => {
  if (!nodes) {
    logger.error('Not Found Redis Nodes');
    return;
  }

  const { host, pwd, dbname, sentinels } = nodes || {};
  let redisClient: Redis;

  try {
    // 判断是否使用Sentinel模式
    if (sentinels && sentinels.trim()) {
      // 🔴 Sentinel模式（生产环境）
      logger.log('Using Redis Sentinel mode');

      const sentinelNodes = sentinels.split(',').map((item) => {
        const [host, port] = item.trim().split(':');
        return {
          host: host,
          port: parseInt(port) || 26379
        };
      });

      redisClient = new Redis({
        sentinels: sentinelNodes,
        name: 'mymaster', // 默认主节点名称
        password: pwd,
        db: parseInt(dbname) || 0,
        lazyConnect: true
      });

      logger.log(`Redis Sentinel nodes: ${JSON.stringify(sentinelNodes)}`);
    } else {
      // 🟢 单机模式（本地开发）
      logger.log('Using Redis standalone mode');

      const [redisHost, redisPort] = host.split(':');

      redisClient = new Redis({
        host: redisHost,
        port: parseInt(redisPort) || 6379,
        password: pwd || undefined,
        db: parseInt(dbname) || 0,
        lazyConnect: true
      });

      logger.log(`Redis standalone: ${redisHost}:${redisPort || 6379}`);
    }

    // 连接事件监听
    redisClient.on('connect', () => {
      logger.log('Redis connected successfully');
      cb?.(redisClient);
    });

    redisClient.on('ready', () => {
      logger.log('Redis ready for commands');
    });

    redisClient.on('error', (error) => {
      logger.error(`Redis connection error: ${error.message}`);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    // 尝试连接
    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error(`Failed to connect to Redis: ${error.message}`);
    throw error;
  }
};
