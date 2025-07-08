import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptSaltRounds: number;
  sessionTimeout: number;
  authWhitelist: {
    path: string;
    method: string;
  }[];
}

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwtSecret: process.env.JWT_SECRET || 'secretKey',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600', 10), // 秒
    authWhitelist: [
      {
        path: '/user/login',
        method: 'POST'
      },
      {
        path: '/health',
        method: 'GET'
      }
    ]
  })
);
