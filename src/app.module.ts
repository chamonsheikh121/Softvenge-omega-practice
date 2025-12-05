import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UserModule } from './main/user/user.module';
import { AuthModule } from './main/auth/auth.module';
import { MailService } from './lib/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationModule } from './main/notification/notification.module';
import { TestController } from './main/test/test.module';
import { NotificationService } from './main/notification/notification.service';
import { NotificationGateway } from './lib/notification/notification.gateway';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 5000,
          limit: 3,
        },
      ],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    NotificationModule,
  ],
  controllers: [AppController, TestController],
  providers: [
    AppService,
    MailService,
    ConfigService,
    NotificationService,
    NotificationGateway,
  ],
})
export class AppModule {}
