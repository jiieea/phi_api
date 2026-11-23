import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private supabaseClient: SupabaseClient,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    // get request
    const req = context.switchToHttp().getRequest();
    // extract token from  req headers
    const token = req.headers.authorization?.replace('Bearer', '');
    // throw unanthorized if token not found (user not login)
    if (!token) throw new UnauthorizedException();

    const { data, error } = await this.supabaseClient.auth.getUser(token);
    if (!data.user || error) throw new UnauthorizedException();

    req.user = await this.prisma.profile.findUnique({
      where: { id: data.user.id },
    });

    return !!req.user;
  }
}
