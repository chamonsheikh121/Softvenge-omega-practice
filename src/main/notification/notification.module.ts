import { NotificationGateway } from '@/lib/notification/notification.gateway';
import { Module } from '@nestjs/common';

@Module({
  imports: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
