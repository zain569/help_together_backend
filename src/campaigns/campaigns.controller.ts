import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';
import { CampaignStatus } from './entities/campaign.entity.js';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.campaignsService.findAll(
      Number(page),
      Number(limit)
    );
  }

  @Get('search')
  searchByTitle(@Query('title') title: string) {
    return this.campaignsService.searchByTitle(title);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: CampaignStatus) {
    return this.campaignsService.findByStatus(status);
  }

  @Get('filter')
  filterCampaigns(
    @Query('causeId') causeId?: string,
    @Query('status') status?: string,
    @Query('zakatEligible') zakatEligible?: string,
    @Query('urgent') urgent?: string,
  ) {
    return this.campaignsService.filterCampaigns(
      causeId,
      status,
      zakatEligible === undefined
        ? undefined
        : zakatEligible === 'true',

      urgent === undefined
        ? undefined
        : urgent === 'true',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Patch('publish/:id')
  publish(@Param('id') id: string) {
    return this.campaignsService.publish(id);
  }

  @Patch('archive/:id')
  archive(@Param('id') id: string) {
    return this.campaignsService.archive(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
