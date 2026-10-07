import { Module } from '@nestjs/common';
import { DonationService } from './donation.service.js';
import { DonationController } from './donation.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity.js';
import { User } from '../user/user.entity.js';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { ServiceGift } from '../service-gifts/entities/service-gift.entity.js';
import { StripeModule } from '../stripe/stripe.module.js';
import { SubscriptionEntity } from './entities/subscriptions.entity.js';
import { JazzcashModule } from '../jazzcash/jazzcash.module.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DonationEntity, User, CampaignEntity, ServiceGift, SubscriptionEntity]),
    StripeModule,
    JazzcashModule
  ],
  controllers: [DonationController],
  providers: [DonationService],
  exports: [DonationService],
})
export class DonationModule { }
