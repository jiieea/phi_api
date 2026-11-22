import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private supabase: SupabaseClient, private prisma: PrismaService) { }
  async canActivate(
    context: ExecutionContext,
  ) {
    // get request 
    const req = context.switchToHttp().getRequest();
    // extract token from  req headers
    const token = req.headers.authorization?.replace("Bearer", "");
    if (!token) throw new UnauthorizedException;

    const { data, error } = await this.supabase.auth.getUser(token);
    if (!data.user || error) throw new UnauthorizedException;


    req.user = await this.prisma.profile.findUnique({
      where: { id: data.user.id }
    });

    return !!req.user;
  }
}
