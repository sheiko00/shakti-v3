import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  // ===================== FOLDERS ===================== //

  async createFolder(name: string, parentId?: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    if (parentId) {
      const parent = await this.prisma.assetFolder.findUnique({ where: { id: parentId } });
      if (!parent) throw new NotFoundException('Parent folder not found');
    }

    return this.prisma.assetFolder.create({
      data: {
        name,
        slug,
        parentId,
      },
    });
  }

  async getFolders(parentId?: string) {
    return this.prisma.assetFolder.findMany({
      where: parentId ? { parentId } : { parentId: null },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { assets: true, subFolders: true } },
      },
    });
  }

  async getFolder(id: string) {
    const folder = await this.prisma.assetFolder.findUnique({
      where: { id },
      include: {
        subFolders: { orderBy: { name: 'asc' }, include: { _count: { select: { assets: true } } } },
        assets: { orderBy: { createdAt: 'desc' }, include: { uploadedBy: { select: { email: true } } } },
        parent: true,
      },
    });
    if (!folder) throw new NotFoundException('Folder not found');
    return folder;
  }

  // ===================== ASSETS ===================== //

  async createAsset(data: any, userId: string) {
    if (data.folderId) {
      const folder = await this.prisma.assetFolder.findUnique({ where: { id: data.folderId } });
      if (!folder) throw new NotFoundException('Folder not found');
    }

    return this.prisma.asset.create({
      data: {
        name: data.name,
        fileUrl: data.fileUrl,
        type: data.type || 'IMAGE',
        size: data.size || 0,
        tags: data.tags || [],
        folderId: data.folderId,
        uploadedById: userId,
      },
    });
  }

  async getAssets(folderId?: string, tag?: string) {
    const where: any = {};
    if (folderId) where.folderId = folderId;
    if (tag) where.tags = { has: tag };

    return this.prisma.asset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: { select: { email: true } }
      }
    });
  }

  async deleteAsset(id: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Asset not found');

    await this.prisma.asset.delete({ where: { id } });
    return { success: true };
  }
}
