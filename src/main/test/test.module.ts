import { Controller, Get } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';

@Controller('test')
export class TestController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('send')
  sendTest() {
    this.notificationService.sendNotification('123', 'Hello from test!');
    return { success: true };
  }
}
