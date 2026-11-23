import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RolesGuard } from '../roles/roles.guard.js';
import { Roles } from '../roles/roles.decorator.js';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard.js';

@Controller('/products')
export class ProductsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly productsService: ProductsService,
  ) {}

  // create product endpoint
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN")
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    this.logger.info("Create Product Endpoint running...")
    return this.productsService.create(createProductDto);
  }

  // Get Product Enpoint (Public)
  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    this.logger.info("Get Product enpoint running...")
    return this.productsService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.info(id);
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard , RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    this.logger.info("Update Endpoint runnig...");
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard , RolesGuard)
  @Roles("ADMIN")
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.info("Remove Endpoint runnig...");
    return this.productsService.remove(id);
  }
}
