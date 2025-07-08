import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublic';

/**
 * 公开接口装饰器 - 用于标记不需要认证的公开接口
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
