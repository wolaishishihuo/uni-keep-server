import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  // 如果指定了特定字段，返回该字段值
  return data ? user?.[data] : user;
});
