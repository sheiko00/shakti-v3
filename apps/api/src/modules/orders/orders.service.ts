import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const VALID_TRANSITIONS: Record<string, string[]> = {
  NEW: ['APPROVED', 'CANCELLED'],
  APPROVED: ['IN_PRODUCTION', 'CANCELLED', 'READY'], // Founder/Ops can skip to READY
  IN_PRODUCTION: ['READY', 'CANCELLED'],
  READY: ['SHIPPED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: [],
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;

    const latestOrder = await this.prisma.order.findFirst({
      where: { orderNumber: { startsWith: prefix } },
      orderBy: { createdAt: 'desc' },
    });

    let nextSequence = 1;
    if (latestOrder) {
      const parts = latestOrder.orderNumber.split('-');
      const lastSequence = parseInt(parts[2], 10);
      if (!isNaN(lastSequence)) {
        nextSequence = lastSequence + 1;
      }
    }

    return `${prefix}${nextSequence.toString().padStart(4, '0')}`;
  }

  async create(data: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const orderNumber = await this.generateOrderNumber();

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          country: data.country,
          paymentMethod: data.paymentMethod,
          subtotal: data.subtotal,
          shippingCost: data.shippingCost || 0,
          total: data.subtotal + (data.shippingCost || 0),
          currency: data.currency || 'USD',
          createdById: userId,
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          statusHistory: {
            create: {
              status: 'NEW',
              previousStatus: null,
              changedById: userId,
              notes: 'Order placed',
            },
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });
      return order;
    });
  }

  async findAll(status?: string, page = 1, limit = 50) {
    const where: any = { isDeleted: false };
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { email: true } },
          assignedTo: { select: { email: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { name: true, coverImageUrl: true } },
            variant: { select: { sku: true, attributes: true } },
          },
        },
        statusHistory: {
          include: {
            changedBy: { select: { email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          include: {
            author: { select: { email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        createdBy: { select: { email: true } },
        assignedTo: { select: { email: true } },
      },
    });

    if (!order || order.isDeleted)
      throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(
    id: string,
    newStatus: any,
    userId: string,
    userRole: string,
    notes?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException('Order not found');

      const oldStatus = order.status;

      // 1. Validation: Same status
      if (oldStatus === newStatus) {
        throw new BadRequestException(
          `Order is already in ${newStatus} status`,
        );
      }

      // 2. Validation: Valid Transition logic
      if (userRole !== 'FOUNDER') {
        const allowedNextStates = VALID_TRANSITIONS[oldStatus] || [];
        if (!allowedNextStates.includes(newStatus)) {
          throw new BadRequestException(
            `Invalid transition from ${oldStatus} to ${newStatus}`,
          );
        }
      }

      // 3. Validation: Role permissions
      if (userRole === 'SUPPLIER') {
        // Supplier can only transition from APPROVED to IN_PRODUCTION, and IN_PRODUCTION to READY
        if (
          !(oldStatus === 'APPROVED' && newStatus === 'IN_PRODUCTION') &&
          !(oldStatus === 'IN_PRODUCTION' && newStatus === 'READY')
        ) {
          throw new ForbiddenException(
            'Supplier is not allowed to perform this transition',
          );
        }
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: newStatus },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: newStatus,
          previousStatus: oldStatus,
          changedById: userId,
          notes,
        },
      });

      return updatedOrder;
    });
  }

  async addNote(id: string, content: string, userId: string) {
    return this.prisma.orderNote.create({
      data: {
        orderId: id,
        content,
        authorId: userId,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
