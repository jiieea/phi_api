import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // create new product , extract variants and spread data product,
  // don't have to map each property of createProductDTO
  create({ variants, ...data }: CreateProductDto) {
    this.logger.info('creating new  product');
    return this.prismaService.products.create({
      data: { ...data, variants: variants ? { create: variants } : undefined },
      include: { variants: true },
    });
  }

  // get all products by categoryId (optional) ,
  findAll(categoryId?: string) {
    this.logger.info('find all  products');
    return this.prismaService.products.findMany({
      where: { isActive: true, ...(categoryId && { categoryId }) },
      include: { categories: true, variants: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    this.logger.info('find spesific product with id ');
    const product = await this.prismaService.products.findUnique({
      where: { id },
      include: { categories: true, variants: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return product;
  }

  async update(id: string, { variants, ...data }: UpdateProductDto) {
    await this.findOne(id);
    return this.prismaService.products.update({
      where: { id },
      data: {
        ...data,
        // if variants sent , the old data should be deleted and update with the new one
        ...(variants && { variants: { deleteMany: {}, create: variants } }),
      },
      include: { variants: true },
    });
  }

  // soft delete , the removed data still exist in DB , the old order still reference this product
  async remove(id: string) {
    await this.findOne(id); // get the product
    return this.prismaService.products.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
