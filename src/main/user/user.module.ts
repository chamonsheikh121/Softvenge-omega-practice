import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class UserModule {}
