import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { SupabaseService } from '../supabase/supabase.service.js';

@Module({
  imports: [SupabaseModule],
  controllers: [ProductsController],
  providers: [ProductsService , PrismaService],
})
export class ProductsModule {}
