import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  // ===================== FOLDERS ===================== //

  @Roles('FOUNDER', 'MARKETING_MANAGER')
  @Post('folders')
  createFolder(
    @Body('name') name: string,
    @Body('parentId') parentId?: string,
  ) {
    return this.assetsService.createFolder(name, parentId);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'OPERATIONS_MANAGER', 'TEAM_MEMBER')
  @Get('folders')
  getFolders(@Query('parentId') parentId?: string) {
    return this.assetsService.getFolders(parentId);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'OPERATIONS_MANAGER', 'TEAM_MEMBER')
  @Get('folders/:id')
  getFolder(@Param('id') id: string) {
    return this.assetsService.getFolder(id);
  }

  // ===================== ASSETS ===================== //

  @Roles('FOUNDER', 'MARKETING_MANAGER')
  @Post()
  createAsset(@Body() createDto: any, @Request() req: any) {
    return this.assetsService.createAsset(createDto, req.user.userId);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER', 'OPERATIONS_MANAGER', 'TEAM_MEMBER')
  @Get()
  getAssets(@Query('folderId') folderId?: string, @Query('tag') tag?: string) {
    return this.assetsService.getAssets(folderId, tag);
  }

  @Roles('FOUNDER', 'MARKETING_MANAGER')
  @Delete(':id')
  deleteAsset(@Param('id') id: string) {
    return this.assetsService.deleteAsset(id);
  }
}
