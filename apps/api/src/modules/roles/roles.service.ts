import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_ROLES = [
  'Founder',
  'Operations Manager',
  'Marketing Manager',
  'Supplier',
  'Media Buyer',
  'Team Member',
];

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultRoles();
  }

  private async seedDefaultRoles() {
    try {
      const rolesCount = await this.prisma.role.count();
      if (rolesCount === 0) {
        this.logger.log('Seeding default roles...');
        const rolesData = DEFAULT_ROLES.map((roleName) => ({
          name: roleName.toUpperCase().replace(/\s+/g, '_'), // e.g. "FOUNDER", "OPERATIONS_MANAGER"
          permissions: [], // Precise permissions will be defined later
          isDefault: true,
        }));

        await this.prisma.role.createMany({
          data: rolesData,
          skipDuplicates: true,
        });

        this.logger.log('Default roles seeded successfully.');
      }
    } catch (error) {
      this.logger.error('Failed to seed default roles', error);
    }
  }

  async findByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }
}
