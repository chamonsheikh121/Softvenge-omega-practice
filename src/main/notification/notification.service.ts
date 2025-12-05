import { NotificationGateway } from '@/lib/notification/notification.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  sendNotification(userId: string, message: string) {
    this.notificationGateway.server.emit('receive_notification', {
      userId,
      message,
      timestamp: new Date(),
    });
  }
}
