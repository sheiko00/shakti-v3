import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

const VALID_SHIPMENT_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'RETURNED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'FAILED_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED_DELIVERY'],
  FAILED_DELIVERY: ['OUT_FOR_DELIVERY', 'RETURNED'],
  DELIVERED: ['RETURNED'], // In case of customer return after delivery
  RETURNED: [],
  CANCELLED: [],
};

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: data.orderId } });
      if (!order) throw new NotFoundException('Order not found');
      if (order.status !== 'READY') {
        throw new BadRequestException(
          'Shipment can only be created for orders that are READY.',
        );
      }

      const shipment = await tx.shipment.create({
        data: {
          orderId: data.orderId,
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          status: 'PENDING',
          shippingCost: data.shippingCost || 0,
          currency: data.currency || 'USD',
          estimatedDeliveryDate: data.estimatedDeliveryDate
            ? new Date(data.estimatedDeliveryDate)
            : null,
          events: {
            create: {
              status: 'PENDING',
              notes: 'Shipment dispatched to carrier',
            },
          },
        },
        include: { events: true },
      });

      // FINANCE AUTO-SYNC: Create Expense for Shipping Cost
      try {
        if (data.shippingCost && data.shippingCost > 0) {
          await tx.expense.create({
            data: {
              title: `Shipping Cost - ${data.trackingNumber}`,
              amount: data.shippingCost,
              currency: data.currency || 'USD',
              category: 'SHIPPING',
              status: 'PAID', // usually shipping is paid upfront
              shipmentId: shipment.id,
              notes: `Auto-synced from Shipping Engine (Carrier: ${data.carrier})`,
            },
          });
        }
      } catch (error) {
        this.logger.error(
          `Failed to auto-sync finance for shipment ${shipment.id}`,
          error,
        );
      }

      return shipment;
    });
  }

  async findAll(status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    return this.prisma.shipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: { orderNumber: true, customerName: true, status: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        order: true,
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }

  async updateStatus(
    id: string,
    newStatus: any,
    userId: string,
    returnReason?: any,
    notes?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({ where: { id } });
      if (!shipment) throw new NotFoundException('Shipment not found');

      const oldStatus = shipment.status;

      if (oldStatus === newStatus) {
        throw new BadRequestException(`Shipment is already ${newStatus}`);
      }

      const allowedNextStates = VALID_SHIPMENT_TRANSITIONS[oldStatus] || [];
      if (!allowedNextStates.includes(newStatus)) {
        throw new BadRequestException(
          `Invalid transition from ${oldStatus} to ${newStatus}`,
        );
      }

      if (newStatus === 'RETURNED' && !returnReason) {
        throw new BadRequestException(
          'Return reason must be provided when returning a shipment',
        );
      }

      const dataToUpdate: any = { status: newStatus };
      if (newStatus === 'DELIVERED') {
        dataToUpdate.actualDeliveryDate = new Date();
      }
      if (newStatus === 'RETURNED') {
        dataToUpdate.returnReason = returnReason;
      }

      const updatedShipment = await tx.shipment.update({
        where: { id },
        data: dataToUpdate,
      });

      // Add to timeline
      await tx.shipmentEvent.create({
        data: {
          shipmentId: id,
          status: newStatus,
          notes,
        },
      });

      // STRICT SYNC LOGIC: Auto status sync with Order
      const order = await tx.order.findUnique({
        where: { id: shipment.orderId },
      });
      if (order) {
        let newOrderStatus: OrderStatus | null = null;

        // Shipment PICKED_UP -> Order SHIPPED (only if Order is READY)
        if (newStatus === 'PICKED_UP' && order.status === 'READY') {
          newOrderStatus = 'SHIPPED';
        }
        // Shipment DELIVERED -> Order DELIVERED (only if Order is SHIPPED)
        else if (newStatus === 'DELIVERED' && order.status === 'SHIPPED') {
          newOrderStatus = 'DELIVERED';
        }
        // Shipment RETURNED -> Order RETURNED
        else if (
          newStatus === 'RETURNED' &&
          (order.status === 'SHIPPED' || order.status === 'DELIVERED')
        ) {
          newOrderStatus = 'RETURNED';
        }

        if (newOrderStatus) {
          await tx.order.update({
            where: { id: order.id },
            data: { status: newOrderStatus },
          });

          let auditNote = `Auto status sync from shipment status: ${newStatus}`;
          if (newStatus === 'RETURNED')
            auditNote += ` (Reason: ${returnReason})`;

          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              status: newOrderStatus,
              previousStatus: order.status,
              changedById: userId,
              notes: auditNote,
            },
          });
        }
      }

      return updatedShipment;
    });
  }
}
