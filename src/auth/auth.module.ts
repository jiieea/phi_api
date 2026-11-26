import { Module } from '@nestjs/common';
import { MeController } from '../me/me.controller.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
@Module({
  imports: [SupabaseModule],
  controllers: [MeController],
  providers: [PrismaService],
})
export class AuthModule {}
