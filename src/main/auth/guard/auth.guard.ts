/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string }; user?: any }>();
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET!,
      });
      req.user = payload; // attach user info to request
      return true;
    } catch (err: unknown) {
      throw new UnauthorizedException(err);
    }
  }
}
