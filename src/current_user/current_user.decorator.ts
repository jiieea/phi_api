import { Reflector } from '@nestjs/core';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export interface AuthUser {
  id: string;
  name: string | null;
  email?: string;
  phone: string | null;
  role: 'user' | 'admin';
  createdAt: Date;

}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) : AuthUser => ctx.switchToHttp().getRequest()
);