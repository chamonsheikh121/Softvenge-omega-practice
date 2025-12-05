/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AuthService } from '@/main/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SignInProvider } from 'generated/prisma/enums';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export interface IvalidateOAuthLogin {
  provider: SignInProvider;
  email: string;
  name: string;
  providerId: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const user = await this.authService.validateOAuthLogin({
        provider: SignInProvider.GOOGLE,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        providerId: profile.id,
      });

      console.log(' user from google stategry', user);

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
