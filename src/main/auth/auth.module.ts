import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '@/lib/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from '@/lib/signInOptions/facebook.stategy';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import Redis from 'ioredis';

@Module({
  imports: [
    JwtModule.register({}),

  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    ConfigService,
   

    // ✅ Prometheus counters MUST be here
    makeCounterProvider({
      name: 'otp_sent_total',
      help: 'Total OTPs sent',
    }),

    makeCounterProvider({
      name: 'otp_verified_total',
      help: 'Total OTPs verified successfully',
    }),
    Redis
  ],
  exports: [AuthService],
})
export class AuthModule {}
