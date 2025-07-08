import { registerAs } from '@nestjs/config';

export interface AppConfig {
  name: string;
  version: string;
  port: number;
  env: string;
  corsOrigins: string[];
  apiPrefix: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    name: process.env.APP_NAME || 'UniKeep健康管理',
    version: process.env.APP_VERSION || '1.0.0',
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'production',
    corsOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    apiPrefix: process.env.API_PREFIX || 'api'
  })
);
