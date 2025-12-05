/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { loginUserDto } from './dto/loginUser.dto';
import { Request, Response } from 'express';
import { forgetPassDto } from './dto/forgetPass.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);

    return {
      success: true,
      message: 'user created successfully',
      data: result,
    };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: loginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginUserDto);
    console.log(result);
    res.cookie('RefreshToken', result.refreshToken, { httpOnly: true });
    return {
      success: true,
      messasge: 'User logged in successfully',
      data: result.accessToken,
    };
  }

  @Post('logout')
  logOut(@Res() res: Response) {
    const result = this.authService.logout();
    res.cookie('RefreshToken', '');
    return {
      success: true,
      messasge: 'User logged out successfully',
      data: result.accessToken,
    };
  }
  @Post('forget-password')
  async forgetPass(@Body() email: forgetPassDto) {
    const result = await this.authService.forgetPass(email);

    return {
      success: true,
      messasge: 'Email has been sent',
      data: result,
    };
  }
  @Post('reset-password')
  async resetPass(@Body() body: { password: string }, @Query() token: string) {
    const result = await this.authService.resetPassword(token, body.password);

    return {
      success: true,
      message: 'Password has been reset successfully',
      data: result, // user info without password
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleSignIn() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user as any;

    res.cookie('access_token', accessToken, { httpOnly: true });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });

    return res.redirect('http://localhost:3000/auth/google/success');
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // Redirects to Facebook login
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user as any;

    // Optionally set cookies
    res.cookie('access_token', accessToken, { httpOnly: true });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });

    // Redirect to frontend
    return res.redirect(
      process.env.FRONTEND_CALLBACK_URL ||
        'http://localhost:3000/auth/facebook/success',
    );
  }
}
