import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger, profile } from 'winston';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private supabaseService: SupabaseService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    // get request from headers
    const req = context.switchToHttp().getRequest();
    // extract token
    const [scheme, token] = (req.headers.authorization ?? '')
      .trim()
      .split(/\s+/);
    // validate header format
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Missing token');
    }
    // verify token with supabase
    const { data, error } =
      await this.supabaseService.client.auth.getUser(token);
    if (!data.user || error) {
      this.logger.info(error);
      throw new UnauthorizedException();
    }
    const profile = await this.prisma.profile.findUnique({
      where: { id: data.user.id },
    });
    req.user = {...profile , email : data.user.email};

    return true
  }
}
