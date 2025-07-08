import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RedisService } from '@src/datasources/redis/redis.service';
import { Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { WechatService } from '@src/modules/third-party/wechat';
import { generateUniqueInviteCode } from '@src/utils/code';
import { UserResponseEntity } from '../user/entitys/userResponse.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly wechatService: WechatService
  ) {}

  // login
  async login(code: string): Promise<any> {
    try {
      const { openid, unionid } = await this.wechatService.code2Session(code);
      console.log('openid', openid);

      const user = await this.userService.findBy({ where: { openId: openid } });

      if (!user.length) {
        // 用户不存在，创建默认用户
        const newUser = await this.userService.create({
          openId: openid,
          unionId: unionid,
          nickname: '微信用户', // 默认昵称
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', // 默认头像
          createdAt: new Date(),
          updatedAt: new Date(),
          inviteCode: generateUniqueInviteCode()
        });

        // 生成token
        const tokenResult = await this.certificate(newUser);

        this.logger.log(`新用户自动注册: ${openid}`);

        return {
          userInfo: new UserResponseEntity(newUser),
          token: tokenResult.token
        };
      }

      // 用户存在，检查并更新微信访问令牌
      const wxAccessToken = await this.redisService.get(`wxAccessToken:${openid}`);
      if (!wxAccessToken) {
        const { access_token, expires_in } = await this.wechatService.getAccessToken();
        await this.redisService.set(`wxAccessToken:${openid}`, access_token, expires_in);
      }

      // 生成token
      const tokenResult = await this.certificate(user[0]);

      this.logger.log(`用户登录成功: ${openid}`);

      return {
        userInfo: new UserResponseEntity(user[0]),
        token: tokenResult.token
      };
    } catch (error) {
      this.logger.error(`用户验证失败: ${error.message}`, error.stack);
      throw error;
    }
  }

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

  // validate user
  async validateUser(id: string): Promise<any> {
    return await this.userService.findBy({ where: { id } });
  }
}
