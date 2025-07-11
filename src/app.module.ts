import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ImageModule } from './image/image.module';
import { ApolloConfigModule } from './datasources/appollo/apolloClient.module';
import { GlobalModule } from './global/global.module';
import { UserModule } from './modules/user/user.module';
import { EsModule } from './datasources/es/es.module';
import { SpiderModule } from './spider/spider.module';
import { KafkaModule } from './datasources/kafka/kafka.module';
import { PrismaModule } from './datasources/prisma/prisma.module';
import { RedisModule } from './datasources/redis/redis.module';
import { MongoDBModule } from './datasources/mongodb/mongodb.module';
// 导入配置文件
import appConfig from './config/app.config';
import { databaseConfig, redisConfig } from './config/database.config';
import { WeightModule } from './modules/weight/weight.module';
import { FastingModule } from './modules/fasting/plan/fasting.module';
import { SystemModule } from './modules/system/system.module';
import { FastingRecordModule } from './modules/fasting/record/fasting-record.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { PushNotificationsModule } from './modules/push-notifications/push-notifications.module';
import authConfig from './config/auth.config';
import businessConfig from './config/business.config';
import thirdPartyConfig from './config/third-party.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'production'}`, '.env'], // 根据 NODE_ENV 加载对应文件
      isGlobal: true, // 全局可用
      load: [appConfig, databaseConfig, redisConfig, authConfig, businessConfig, thirdPartyConfig] // 加载配置文件
    }),
    // 静态资源服务
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static'
    }),
    GlobalModule,
    ApolloConfigModule,
    PrismaModule,
    HealthModule,
    ImageModule,
    UserModule,
    MongoDBModule,
    EsModule,
    KafkaModule,
    RedisModule,
    SpiderModule,
    WeightModule,
    FastingModule,
    SystemModule,
    FastingRecordModule,
    AchievementModule,
    PushNotificationsModule
  ], // 依赖注入
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
