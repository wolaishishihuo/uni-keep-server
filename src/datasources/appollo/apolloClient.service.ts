import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalService } from '@src/global/global.service';
import { connectPrisma } from '@src/datasources/prisma';
import { connectMongoDB } from '@src/datasources/mongodb';
import { connectEs } from '@src/datasources/es';
import { connectKafka } from '@src/datasources/kafka';
import { connectRedis } from '@src/datasources/redis';
import { DatabaseConfig, RedisConfig } from '@src/config/database.config';
import { ThirdPartyConfig } from '@src/config/third-party.config';
import {
  APOLLO_HOST,
  APOLLO_CONFIG_SERVER_URL,
  APOLLO_CLUSTERNAME,
  APOLLO_NAMESPACELIST,
  APOLLO_APPID,
  APOLLO_ENABLED
} from '@src/common/constants';
import { ApolloClient } from './apollo';
// import { createUser } from '@src/datasources/mongodb/service/user';
@Injectable()
export class ApolloConfigService {
  private readonly logger = new Logger(ApolloConfigService.name);
  private apolloClient;
  private configs;
  private isInited;
  private isChanged;
  constructor(
    private readonly globalService: GlobalService,
    private readonly configService: ConfigService
  ) {
    if (APOLLO_ENABLED) {
      this.startApolloServer();
      this.onConfigInit();
      this.onConfigChange();
    } else {
      this.logger.warn('Apollo is disabled, using local configurations');
      this.isInited = true; // 标记为已初始化，避免阻塞
    }
  }
  // 读取Apollo配置（或使用ConfigService配置）
  async getApolloConfigs() {
    if (!APOLLO_ENABLED) {
      // 使用ConfigService替代直接读取环境变量
      const databaseConfig = this.configService.get<DatabaseConfig>('database')!;
      const redisConfig = this.configService.get<RedisConfig>('redis')!;
      const thirdPartyConfig = this.configService.get<ThirdPartyConfig>('thirdParty')!;

      return {
        mysql: {
          host: databaseConfig.host,
          username: databaseConfig.username,
          pwd: databaseConfig.password,
          dbname: databaseConfig.database
        },
        redis: {
          host: `${redisConfig.host}:${redisConfig.port}`,
          pwd: redisConfig.password,
          dbname: redisConfig.db.toString()
        },
        // 可选组件配置
        kafka: {
          clientId: thirdPartyConfig.kafka.clientId,
          brokers: thirdPartyConfig.kafka.brokers
        },
        es: { host: '' }, // ES暂未配置
        mongodb: {
          username: thirdPartyConfig.mongodb.username,
          pwd: thirdPartyConfig.mongodb.password,
          host: thirdPartyConfig.mongodb.host,
          dbname: thirdPartyConfig.mongodb.database
        }
      };
    }

    if (!this.isInited) {
      await this.onConfigInit();
    }
    const configs = this.configs || (await this.apolloClient.getConfigs()) || {};
    let config = {
      kafka: { clientId: '', brokers: '' },
      es: { host: '' },
      mongodb: { username: '', pwd: '', host: '', dbname: '' },
      mysql: { username: '', pwd: '', host: '', dbname: '', robot: {} },
      redis: { host: '', dbname: '', pwd: '', sentinels: '' }
    };
    // 解析配置
    Object.keys(configs)?.forEach((key) => {
      config = { ...config, ...configs[key]?.configurations };
    });

    return config;
  }
  // 获取prisma的连接信息
  async getPrismaConnection() {
    const { mysql } = await this.getApolloConfigs();
    if (!mysql) {
      return;
    }
    const { host, username, pwd, dbname } = mysql;
    if (!host || !username || !pwd || !dbname) {
      return;
    }
    const PRISMA_CONNECTION_STRING = `mysql://${username}:${pwd}@${host}/${dbname}?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true`;
    // this.logger.log(`PRISMA_CONNECTION_STRING: ${PRISMA_CONNECTION_STRING}`);
    return PRISMA_CONNECTION_STRING;
  }
  // 获取mogodb的连接信息
  async getMongodbConnection() {
    const { mongodb } = await this.getApolloConfigs();
    if (!mongodb) {
      return;
    }
    const { host, username, pwd, dbname } = mongodb;

    const MONGODB_CONNECTION_STRING = `mongodb://${username}:${pwd}@${host}/${dbname}?retryWrites=true`;
    // this.logger.log(`MONGODB_CONNECTION_STRING: ${MONGODB_CONNECTION_STRING}`);
    return MONGODB_CONNECTION_STRING;
  }
  // 获取es的连接信息
  async getESConnection() {
    const { es } = await this.getApolloConfigs();
    if (!es?.host) {
      return;
    }
    return es?.host;
  }
  // 获取kafka的连接信息
  async getKafkaConnection() {
    const { kafka } = await this.getApolloConfigs();
    if (!kafka?.clientId || !kafka?.brokers) {
      return;
    }
    return kafka;
  }
  // 获取redis的连接信息
  async getRedisConnection() {
    const { redis } = await this.getApolloConfigs();
    // || !redis?.sentinels
    if (!redis?.host) {
      return;
    }
    return redis;
  }
  // prisma连接
  async prismaConnect() {
    const datasourceUrl = await this.getPrismaConnection();
    if (!datasourceUrl) {
      return;
    }
    // mysql数据库连接
    connectPrisma(datasourceUrl, this.logger, (prisma) => {
      this.globalService.setPrisma(prisma);
    });
  }
  // monogo连接
  async mogodbConnect() {
    const monogodbUrl = await this.getMongodbConnection();
    if (!monogodbUrl) {
      return;
    }
    await connectMongoDB(monogodbUrl, this.logger);
    // await createUser({ name: 'kim', password: '123456' });
  }
  // kafka连接
  async kafkaConnect() {
    const kafkaInfo = await this.getKafkaConnection();
    if (!kafkaInfo) {
      return;
    }
    await connectKafka(kafkaInfo, this.logger, (kafka, groupId) => {
      this.globalService.setKafka(kafka, groupId);
    });
  }
  // es连接
  async esConnect() {
    // es
    const esNodes = await this.getESConnection();
    if (!esNodes) {
      return;
    }
    await connectEs(esNodes, this.logger, (es) => {
      this.globalService.setEs(es);
    });
  }
  // redis连接
  async redisConnect() {
    const redisInfo = await this.getRedisConnection();
    if (!redisInfo) {
      return;
    }
    await connectRedis(redisInfo, this.logger, (redis) => {
      this.globalService.setRedis(redis);
    });
  }
  // 启动apollo Client
  startApolloServer() {
    try {
      // apollo客户端实例  host配置：192.168.10.1 apollo-config.91160.com（开发、测试环境）
      if (this.apolloClient) {
        return;
      }
      this.apolloClient = new ApolloClient({
        metaServerUrl: APOLLO_HOST,
        configServerUrl: APOLLO_CONFIG_SERVER_URL, // 直接指定配置服务器
        clusterName: APOLLO_CLUSTERNAME,
        namespaceList: APOLLO_NAMESPACELIST,
        appId: APOLLO_APPID
      });
    } catch (err) {
      this.logger.log(`ApolloClient connect error: ${err}`);
    }
  }
  // 监控配置变更
  onConfigInit() {
    return new Promise((resolve) => {
      this.apolloClient?.init().then(() => {
        if (!this.isInited) {
          this.logger.log(`ApolloClient init done`);
        }
        this.isInited = true;
        resolve(this.isInited);
      });
    });
  }

  // 监控配置变更
  onConfigChange() {
    return new Promise((resolve) => {
      this.apolloClient?.onChange((config) => {
        this.configs = config;
        this.isChanged = true;
        // this.logger.log(`ApolloClient config changed done`);
        resolve(this.isChanged);
      });
    });
  }
}
