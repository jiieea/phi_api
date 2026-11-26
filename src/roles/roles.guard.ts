import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from '../generated/prisma/enums.js';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<ROLE[]>('roles', context.getHandler());
    if (!roles) return true;
    return roles.includes(request.user.role);
  }
}
