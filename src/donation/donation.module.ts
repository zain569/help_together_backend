import { Module } from '@nestjs/common';
import { DonationService } from './donation.service.js';
import { DonationController } from './donation.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity.js';
import { User } from '../user/user.entity.js';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { ServiceGift } from '../service-gifts/entities/service-gift.entity.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DonationEntity, User, CampaignEntity, ServiceGift])
  ],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule { }
