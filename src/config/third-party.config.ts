import { registerAs } from '@nestjs/config';

export interface WechatConfig {
  miniAppId: string;
  miniAppSecret: string;
  enableWechatAuth: boolean;
}

export interface ApolloConfig {
  enabled: boolean;
  host: string;
  configServerUrl: string;
  appId: string;
  clusterName: string;
  namespaceList: string[];
}

export interface KafkaConfig {
  clientId: string;
  brokers: string;
  groupId: string;
  enabled: boolean;
}

export interface MongoDBConfig {
  username: string;
  password: string;
  host: string;
  database: string;
  enabled: boolean;
}

export interface ThirdPartyConfig {
  wechat: WechatConfig;
  apollo: ApolloConfig;
  kafka: KafkaConfig;
  mongodb: MongoDBConfig;
}

export default registerAs(
  'thirdParty',
  (): ThirdPartyConfig => ({
    wechat: {
      miniAppId: process.env.WECHAT_MINI_APP_ID || '',
      miniAppSecret: process.env.WECHAT_MINI_APP_SECRET || '',
      enableWechatAuth: process.env.ENABLE_WECHAT_AUTH === 'true'
    },
    apollo: {
      enabled: process.env.APOLLO_ENABLED === 'true',
      host: process.env.APOLLO_HOST || 'http://apollo-config.91160.com',
      configServerUrl: process.env.APOLLO_CONFIG_SERVER_URL || 'http://apollo-config.91160.com',
      appId: process.env.APOLLO_APP_ID || 'uni-keep-server',
      clusterName: process.env.APOLLO_CLUSTER || 'default',
      namespaceList: process.env.APOLLO_NAMESPACE?.split(',') || ['application']
    },
    kafka: {
      clientId: process.env.KAFKA_CLIENT_ID || 'uni-keep-client',
      brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
      groupId: process.env.KAFKA_GROUP_ID || 'uni-keep-group',
      enabled: process.env.KAFKA_ENABLED === 'true'
    },
    mongodb: {
      username: process.env.MONGODB_USERNAME || '',
      password: process.env.MONGODB_PASSWORD || '',
      host: process.env.MONGODB_HOST || 'localhost:27017',
      database: process.env.MONGODB_DBNAME || 'uniKeep',
      enabled: process.env.MONGODB_ENABLED === 'true'
    }
  })
);
