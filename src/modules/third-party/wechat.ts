import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThirdPartyConfig } from '../../config/third-party.config';
import instance from '../../api/request';

/**
 * 微信API响应接口
 */
export interface WechatCode2SessionResponse {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

export interface WechatAccessTokenResponse {
  access_token: string;
  expires_in: number;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * 获取微信配置
   */
  private getWechatConfig() {
    const wechatConfig = this.configService.get<ThirdPartyConfig>('thirdParty')!.wechat;

    if (!wechatConfig.miniAppId || !wechatConfig.miniAppSecret) {
      throw new Error('微信小程序配置缺失：请检查 WECHAT_MINI_APP_ID 和 WECHAT_MINI_APP_SECRET 环境变量');
    }

    return {
      appId: wechatConfig.miniAppId,
      appSecret: wechatConfig.miniAppSecret
    };
  }

  /**
   * 小程序登录 - code2Session
   */
  async code2Session(code: string): Promise<WechatCode2SessionResponse> {
    const { appId, appSecret } = this.getWechatConfig();

    return new Promise((resolve, reject) => {
      const params = {
        appid: appId,
        secret: appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      };

      instance
        .get('https://api.weixin.qq.com/sns/jscode2session', { params })
        .then(({ data }) => {
          // 检查微信API返回的错误
          if (data.errcode) {
            this.logger.error(`微信code2Session错误: ${data.errcode} - ${data.errmsg}`);
            reject(new Error(`微信登录失败: ${data.errmsg}`));
            return;
          }

          // 验证必要字段
          if (!data.openid || !data.session_key) {
            reject(new Error('微信返回数据不完整'));
            return;
          }

          this.logger.log(`微信登录成功，openid: ${data.openid.substring(0, 8)}***`);
          resolve(data);
        })
        .catch((error) => {
          this.logger.error('调用微信code2Session接口失败:', error.message);
          reject(error);
        });
    });
  }

  /**
   * 获取小程序全局唯一后台接口调用凭据
   */
  async getAccessToken(): Promise<WechatAccessTokenResponse> {
    const { appId, appSecret } = this.getWechatConfig();

    return new Promise((resolve, reject) => {
      const params = {
        grant_type: 'client_credential',
        appid: appId,
        secret: appSecret
      };

      instance
        .get('https://api.weixin.qq.com/cgi-bin/token', { params })
        .then(({ data }) => {
          if (data.errcode) {
            this.logger.error(`获取微信access_token错误: ${data.errcode} - ${data.errmsg}`);
            reject(new Error(`获取access_token失败: ${data.errmsg}`));
            return;
          }

          this.logger.log('获取微信access_token成功');
          resolve(data);
        })
        .catch((error) => {
          this.logger.error('获取微信access_token失败:', error.message);
          reject(error);
        });
    });
  }

  /**
   * 获取用户手机号
   */
  async getPhoneNumber(accessToken: string, code: string) {
    return new Promise((resolve, reject) => {
      instance
        .post(
          `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
          { code },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(({ data }) => {
          if (data.errcode !== 0) {
            this.logger.error(`获取用户手机号错误: ${data.errcode} - ${data.errmsg}`);
            reject(new Error(`获取手机号失败: ${data.errmsg}`));
            return;
          }

          resolve(data);
        })
        .catch((error) => {
          this.logger.error('获取用户手机号失败:', error.message);
          reject(error);
        });
    });
  }
}
