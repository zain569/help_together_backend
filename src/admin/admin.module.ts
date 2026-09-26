import { Module } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';
import { User } from '../user/user.entity.js';
import { DonationEntity } from '../donation/entities/donation.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { ServiceGift } from '../service-gifts/entities/service-gift.entity.js';
import { Faq } from '../faq/entities/faq.entity.js';
import { CauseEntity } from '../causes/entities/cause.entity.js';
import { ContactEntity } from '../contact/entities/contact.entity.js';
import { Testimonial } from '../testimonial/entities/testimonial.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignEntity, User, DonationEntity, ServiceGift, Faq, CauseEntity, ContactEntity, Testimonial]),
    AuthModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
