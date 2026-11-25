import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: string;
  username: string | null;
  email?: string;
  phone: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, context) => {
    return  context.switchToHttp().getRequest().user;
  },
);
