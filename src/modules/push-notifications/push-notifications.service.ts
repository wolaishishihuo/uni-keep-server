import { Inject, Injectable } from '@nestjs/common';
import { Notification, NotificationStatus, NotificationType, PrismaClient } from '@prisma/client';

@Injectable()
export class PushNotificationsService {
  constructor(@Inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async createPushNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    content: string;
    immediate: boolean;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        status: NotificationStatus.pending
      }
    });

    if (data.immediate) {
      await this.sendPushNotification(notification);
    }

    return notification;
  }

  // 立即发送通知
  async sendPushNotification(notification: Notification) {
    // 发送通知
    try {
      // 调用微信小程序的接口
      // 更新通知状态
    } catch (error) {
      // 更新错误通知状态
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status: NotificationStatus.failed, errorMessage: error.message }
      });
    }
  }
}
