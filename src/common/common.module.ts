import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProductsModule } from '../products/products.module.js';
@Module({
  imports: [
    UserModule,
    PrismaModule,
    ProductsModule,
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class CommonModule {}
