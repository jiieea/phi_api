import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard.js';
import * as User from '../auth/current_user/current_user.decorator.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  CurrentUser,
  AuthUser,
} from '../auth/current_user/current_user.decorator.js';
@Controller('me')
export class MeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user : User.AuthUser) {
    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      role: user.role,
      memberSince: user.createdAt,
    };
  }
}
