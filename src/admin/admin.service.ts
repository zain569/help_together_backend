import { Injectable } from '@nestjs/common';
import { DonationEntity, PaymentStatus } from '../donation/entities/donation.entity.js';
import { User } from '../user/user.entity.js';
import { CampaignEntity, CampaignStatus } from '../campaigns/entities/campaign.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceGift } from '../service-gifts/entities/service-gift.entity.js';
import { Faq } from '../faq/entities/faq.entity.js';
import { CauseEntity } from '../causes/entities/cause.entity.js';
import { ContactEntity } from '../contact/entities/contact.entity.js';
import { Testimonial } from '../testimonial/entities/testimonial.entity.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(DonationEntity)
    private readonly donationRep: Repository<DonationEntity>,

    @InjectRepository(User)
    private readonly userRep: Repository<User>,

    @InjectRepository(CampaignEntity)
    private readonly campaignRep: Repository<CampaignEntity>,

    @InjectRepository(ServiceGift)
    private readonly serviceGiftRep: Repository<ServiceGift>,

    @InjectRepository(Faq)
    private readonly faq: Repository<Faq>,

    @InjectRepository(CauseEntity)
    private readonly causeEntity: Repository<CauseEntity>,

    @InjectRepository(ContactEntity)
    private readonly contactEmtity: Repository<ContactEntity>,

    @InjectRepository(Testimonial)
    private readonly testimonial: Repository<Testimonial>,
  ) { }
  async adminDashboard() {
    //total collected amount

    const result = await this.donationRep
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .where('donation.paymentStatus = :status', {
        status: PaymentStatus.SUCCEEDED,
      })
      .getRawOne();

    const collectedAmnount = Number(result.total) || 0;

    //total users

    const totalUser = await this.userRep.count();

    //users who donated

    const usersWhoDonated = await this.donationRep
      .createQueryBuilder('donation')
      .select('COUNT(DISTINCT donation.userId)', 'count')
      .where('donation.paymentStatus = :status', {
        status: PaymentStatus.SUCCEEDED,
      })
      .getRawOne();

    //last 5 donations

    const latestDonations = await this.donationRep.find({
      relations: {
        campaign: true,
        user: true,
      },
      order: {
        createdAt: "DESC"
      },
    });

    const donationsWithoutPasswords = latestDonations.map((donation) => ({
      ...donation,
      user: donation.user
        ? (({ password: _password, ...user }) => user)(donation.user)
        : donation.user,
    }));

    //latest 5 campaigns

    const latestCampaign = await this.campaignRep.find({
      order: {
        createdAt: "DESC",
      },
      relations: {
        cause: true,
      },
    });

    //Latest Services

    const latestServices = await this.serviceGiftRep.find({
      order: {
        id: "DESC",
      },
    })

    const faqs = await this.faq.find({
      order: {
        id: "DESC"
      }
    })

    //send causes

    const causes = await this.causeEntity.find({
      order: {
        id: "DESC"
      }
    })

    const contacts = await this.contactEmtity.find({
      order: {
        id: "DESC"
      }
    })

    //Send Reviews
    const testimonials = await this.testimonial.find({
      order: {
        id: "DESC"
      },
    })

    return {
      collectedAmnount,
      totalUser,
      usersWhoDonated: Number(usersWhoDonated.count) || 0,
      latestDonations: donationsWithoutPasswords,
      latestCampaign,
      latestServices,
      faqs,
      causes,
      contacts,
      testimonials,
    };
  }

  async ourUsers() {
    const totalDonationsResult = await this.donationRep
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .where('donation.paymentStatus = :status', {
        status: PaymentStatus.SUCCEEDED,
      })
      .getRawOne();

    const totalDonations = Number(totalDonationsResult.total) || 0;

    const totalActiveCampaigns = await this.campaignRep.count({
      where: {
        status: CampaignStatus.PUBLISHED,
      },
    });

    const peoplesHelped = await this.donationRep
      .createQueryBuilder('donation')
      .innerJoin('donation.campaign', 'campaign')
      .where('donation.paymentStatus = :status', {
        status: PaymentStatus.SUCCEEDED,
      })
      .getCount();

    const result = await this.donationRep
      .createQueryBuilder('donation')
      .select('COUNT(DISTINCT donation.userId)', 'count')
      .where('donation.paymentStatus = :status', {
        status: PaymentStatus.SUCCEEDED,
      })
      .andWhere('donation.userId IS NOT NULL')
      .getRawOne();

    return {
      totalDonations,
      totalActiveCampaigns,
      peoplesHelped,
      ourUsers: Number(result.count) || 0,
    };
  }
}
