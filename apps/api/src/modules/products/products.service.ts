import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { variants, ...productData } = data;

    return this.prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants || [],
        },
      },
      include: {
        variants: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        variants: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });
  }
}
