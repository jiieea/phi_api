import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
