import { Injectable, ExecutionContext, ForbiddenException, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { pathToRegexp } from 'path-to-regexp';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthConfig } from '@src/config/auth.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private globalWhiteList = [];

  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService
  ) {
    super();
    // 从配置中读取白名单，如果没有配置则使用默认白名单
    const authWhitelist = this.config.get<AuthConfig>('auth')!.authWhitelist;
    this.globalWhiteList = [].concat(authWhitelist);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    // 检查是否有 @Public 装饰器（不需要认证）
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);

    if (isPublic) {
      this.logger.debug(`公开接口访问: ${request.method} ${request.url}`);
      await this.jumpActivate(ctx);
      return true;
    }

    // 检查白名单
    const isInWhiteList = this.checkWhiteList(ctx);
    if (isInWhiteList) {
      this.logger.debug(`白名单接口访问: ${request.method} ${request.url}`);
      await this.jumpActivate(ctx);
      return true;
    }

    // 检查Authorization头
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.logger.warn(`缺少认证头: ${request.method} ${request.url} - IP: ${this.getClientIp(request)}`);
      throw new ForbiddenException('请提供认证token');
    }

    // 检查token格式
    if (!authHeader.startsWith('Bearer ')) {
      this.logger.warn(`无效的认证格式: ${request.method} ${request.url}`);
      throw new UnauthorizedException('认证格式错误，请使用Bearer token');
    }

    this.logger.debug(`JWT认证请求: ${request.method} ${request.url}`);

    return this.activate(ctx);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    try {
      return await (super.canActivate(ctx) as Promise<boolean>);
    } catch (error) {
      const request = ctx.switchToHttp().getRequest();
      this.logger.error(`JWT认证失败: ${request.method} ${request.url} - ${error.message}`);
      throw error;
    }
  }

  /**
   * 跳过JWT验证，但仍尝试解析用户信息（如果存在token）
   */
  async jumpActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      await this.activate(ctx);
    } catch (error) {
      // 对于公开接口或白名单接口，认证失败不抛出异常
      this.logger.debug(`跳过认证的接口尝试解析用户信息失败: ${error.message}`);
    }
    return true;
  }

  /**
   * 检查接口是否在白名单内
   */
  checkWhiteList(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest();

    const matchedRoute = this.globalWhiteList.find((route) => {
      // 检查HTTP方法
      if (route.method && request.method.toUpperCase() !== route.method.toUpperCase()) {
        return false;
      }

      // 检查路径（支持正则表达式）
      try {
        const { regexp } = pathToRegexp(route.path);
        return regexp.test(request.url);
      } catch (error) {
        this.logger.warn(`白名单路径配置错误: ${route.path}`);
        return false;
      }
    });

    return !!matchedRoute;
  }

  /**
   * 处理认证成功后的用户信息
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      this.logger.error(`JWT认证处理失败: ${request.url}`, {
        error: err?.message,
        info: info?.message,
        ip: this.getClientIp(request)
      });
      throw err || new UnauthorizedException('认证失败');
    }

    // 记录成功的认证（生产环境建议调整为debug级别）
    this.logger.log(`用户认证成功: ${user.openId || user.sub || user.id} - ${request.url}`);

    // 将用户信息附加到请求对象
    request.user = user;

    return user;
  }

  /**
   * 获取客户端IP地址
   */
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }
}
