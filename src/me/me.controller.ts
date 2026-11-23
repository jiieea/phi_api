import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard.js';
import * as current_userDecorator from '../current_user/current_user.decorator.js';
@Controller('me')
export class MeController {
  @Get()
  @UseGuards(JwtAuthGuard)
  me(
    @current_userDecorator.CurrentUser() user: current_userDecorator.AuthUser,
  ) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      memberSince: user.createdAt
    }
  }
}
