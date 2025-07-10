import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RedisService } from '@src/datasources/redis/redis.service';
import { Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { WechatService } from '@src/modules/third-party/wechat';
import { generateUniqueInviteCode } from '@src/utils/code';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly wechatService: WechatService
  ) {}

  // jwt certificate
  async certificate(user: User) {
    const payload = {
      id: user.id,
      sub: user.id,
      openId: user.openId
    };
    try {
      const token = this.jwtService.sign(payload);
      return { token };
    } catch (error) {
      throw new NotAcceptableException(error.message || 'Certificate error.');
    }
  }

  // 用于LocalStrategy的微信验证方法
  async validateWechatCode(code: string): Promise<User> {
    try {
      const { openid, unionid } = await this.wechatService.code2Session(code);
      this.logger.log(`微信验证openid: ${openid}`);

      let user = await this.userService.findBy({ where: { openId: openid } });

      if (!user.length) {
        // 用户不存在，创建默认用户
        const newUser = await this.userService.create({
          openId: openid,
          unionId: unionid,
          nickname: '微信用户',
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
          inviteCode: generateUniqueInviteCode()
        });

        this.logger.log(`新用户自动注册: ${openid}`);
        user = [newUser];
      }

      // 检查并更新微信访问令牌
      const wxAccessToken = await this.redisService.get(`wxAccessToken:${openid}`);
      if (!wxAccessToken) {
        const { access_token, expires_in } = await this.wechatService.getAccessToken();
        await this.redisService.set(`wxAccessToken:${openid}`, access_token, expires_in);
      }

      this.logger.log(`用户登录成功: ${openid}`);
      return user[0]; // 返回用户信息给LocalStrategy
    } catch (error) {
      this.logger.error(`微信验证失败: ${error.message}`, error.stack);
      return null;
    }
  }
}
