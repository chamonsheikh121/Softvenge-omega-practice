/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    console.log(user);

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
