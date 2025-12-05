/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AuthService } from '@/main/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SignInProvider } from 'generated/prisma/enums';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
      enableProof: true,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const email = profile.emails?.[0]?.value;
    const user = await this.authService.validateOAuthLogin({
      provider: SignInProvider.FACEBOOK,
      providerId: profile.id,
      email,
      name:
        profile.displayName ||
        `${profile.name.givenName} ${profile.name.familyName}`,
    });

    done(null, user);
  }
}
