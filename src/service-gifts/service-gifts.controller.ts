import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiceGiftsService } from './service-gifts.service.js';
import { CreateServiceGiftDto } from './dto/create-service-gift.dto.js';
import { UpdateServiceGiftDto } from './dto/update-service-gift.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';

@Controller('servicegifts')
export class ServiceGiftsController {
  constructor(private readonly serviceGiftsService: ServiceGiftsService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createServiceGiftDto: CreateServiceGiftDto) {
    return this.serviceGiftsService.create(createServiceGiftDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  findAll() {
    return this.serviceGiftsService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('getbyadmin')
  findAllByAdmin() {
    return this.serviceGiftsService.findAllByadmin()
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceGiftsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceGiftDto: UpdateServiceGiftDto) {
    return this.serviceGiftsService.update(id, updateServiceGiftDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceGiftsService.remove(id);
  }
}
