/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { loginUserDto } from './dto/loginUser.dto';
import { MailService } from '@/lib/mail/mail.service';
import { forgetPassDto } from './dto/forgetPass.dto';
import { IvalidateOAuthLogin } from '@/lib/signInOptions/google.strategry';
import Redis from 'ioredis';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);


  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly redis: Redis,

    @InjectMetric('otp_sent_total')
    private readonly otpSentCounter: Counter<string>,

    @InjectMetric('otp_verified_total')
    private readonly otpVerifiedCounter: Counter<string>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.prisma.client.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new BadRequestException('User already exist');
    }

    const hash = await argon2.hash(createUserDto.password);

    const createUser = await this.prisma.client.user.create({
      data: { ...createUserDto, password: hash },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `verify-email-${createUser.email}`;
    await this.redis.set(key, otp, 'EX', 130);

    this.logger.log(`OTP generated for ${createUser.email}: ${otp}`);
    this.logger.debug(`Saved OTP in Redis key: ${key}`);
    await this.mailService.sendOTP(createUser!.email, String(otp));
    this.otpSentCounter.inc();
    return createUser;
  }
  async verifyOtp(email: string, userOtp: string) {
    const key = `verify-email-${email}`;
    this.logger.log(`Verifying OTP for ${email}`);
    const storedOtp = await this.redis.get(key);

    if (!storedOtp) {
      this.logger.warn(`OTP expired or not found for ${email}`);
      throw new BadRequestException('OTP expired or invalid');
    }

    if (storedOtp !== userOtp) {
      this.logger.warn(`Incorrect OTP submitted for ${email}`);
      throw new BadRequestException('Incorrect OTP');
    }

    // OTP verified → delete key
    await this.redis.del(key);
    this.logger.log(`OTP verified and key deleted for ${email}`);
    this.otpVerifiedCounter.inc();

    const user = await this.prisma.client.user.update({
      where: { email },
      data: { isVerified: true },
    });

    return user;
  }

  async login(loginUserDto: loginUserDto) {
    const user = await this.prisma.client.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const accessToken = await this.generateAccessToken(user?.email, user.role);
    const refreshToken = await this.generateRefreshToken(
      user?.email,
      user.role,
    );

    return { accessToken, refreshToken };
  }

  async generateAccessToken(userId: string, userRole: string) {
    const payload = { userId, userRole };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.ACCESS_TOKEN_SECRET!,
    });
  }
  async generateRefreshToken(userId: string, userRole: string) {
    const payload = { userId, userRole };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1m',
      secret: process.env.REFRESH_TOKEN_SECRET!,
    });
  }

  logout() {
    return {
      accessToken: null,
    };
  }

  async forgetPass(dto: forgetPassDto) {
    const user = await this.prisma.client.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new BadRequestException(`No user found by ${dto.email}`);
    }

    const payload = {
      email: user.email,
      role: user.role,
    };

    const emailResetToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: process.env.FORGET_PASS_SECRET!,
    });

    await this.mailService.sendForgetPassMail(user.email, emailResetToken);
    return 'Forget password email sent successfully';
  }

  async resetPassword(token: string, password: string) {
    // 1. Verify token
    const payload = await this.verifyResetToken(token);

    // 2. Hash new password
    const hash = await argon2.hash(password);

    // 3. Update user in database
    const updatedUser = await this.prisma.client.user.update({
      where: { email: payload.email },
      data: { password: hash },
    });

    // 4. Exclude password before returning
    const { password: _pass, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async verifyResetToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.FORGET_PASS_SECRET!,
      });
      return payload; // contains { email }
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async validateOAuthLogin({
    provider,
    email,
    name,
    providerId,
  }: IvalidateOAuthLogin) {
    let user;

    // Try to find user by provider + providerId first
    if (providerId) {
      user = await this.prisma.client.user.findFirst({
        where: {
          providerId,
        },
      });
    }

    // If not found and email exists, try find by email
    if (!user && email) {
      user = await this.prisma.client.user.findUnique({
        where: { email },
      });
    }

    // If still not found, create new user
    if (!user) {
      user = await this.prisma.client.user.create({
        data: { provider, providerId, email, name },
      });
    }

    const accessToken = await this.generateAccessToken(user.email, user.role);
    const refreshToken = await this.generateRefreshToken(user.email, user.role);

    return { user, accessToken, refreshToken };
  }
}
