import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UpdateService } from './update.service.js';
import { CreateUpdateDto } from './dto/create-update.dto.js';
import { UpdateUpdateDto } from './dto/update-update.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createUpdateDto: CreateUpdateDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.updateService.create(createUpdateDto, image);
  }

  @Get()
  findAll() {
    return this.updateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.updateService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUpdateDto: UpdateUpdateDto) {
    return this.updateService.update(id, updateUpdateDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.updateService.remove(id);
  }
}
