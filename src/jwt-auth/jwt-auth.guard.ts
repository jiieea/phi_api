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
import { Logger } from 'winston';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private supabaseService: SupabaseService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    console.log('SUPABASE_URL', process.env.SUPABASE_URL);
    console.log(
      'SUPABASE_KEY starts with',
      process.env.SUPABASE_KEY?.slice(0, 12),
    );
    console.log(
      'Auth header starts with',
      req.headers.authorization?.slice(0, 20),
    );
    // get request
    // extract token from  req headers
    // this.logger.info(token);
    // // throw unanthorized if token not found (user not login)
    // if (!token) throw new UnauthorizedException();
    //
    // console.log(
    //   'header start:',
    //   JSON.stringify(req.headers.authorization?.slice(0, 15)),
    // );
    // console.log(
    //   'token start:',
    //   JSON.stringify(token.slice(0, 6)),
    //   '| length:',
    //   token.length,
    //   '| has whitespace:',
    //   /\s/.test(token),
    // );

    const [scheme, token] = (req.headers.authorization ?? '')
      .trim()
      .split(/\s+/);
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Missing token');
    }
    const { data, error } =
      await this.supabaseService.client.auth.getUser(token);
    if (!data.user || error) {
      this.logger.info(error);
      throw new UnauthorizedException();
    }

    req.user = await this.prisma.profile.findUnique({
      where: { id: data.user.id },
    });

    return !!req.user;
  }
}
