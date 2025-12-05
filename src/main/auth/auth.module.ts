import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from '@/lib/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '@/lib/signInOptions/google.strategry';
import { FacebookStrategy } from '@/lib/signInOptions/facebook.stategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}), // config via JwtService.signAsync call above
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    MailService,
    ConfigService,
    FacebookStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
