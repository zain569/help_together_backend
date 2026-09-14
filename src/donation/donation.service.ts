import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity.js';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';
import { ServiceGift } from '../service-gifts/entities/service-gift.entity.js';
import { UserRole } from '../user/user.entity.js';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(DonationEntity)
    private readonly donationRep: Repository<DonationEntity>,

    @InjectRepository(User)
    private readonly userRep: Repository<User>,

    @InjectRepository(CampaignEntity)
    private readonly campaignRep: Repository<CampaignEntity>,

    @InjectRepository(ServiceGift)
    private readonly SerGifRep: Repository<ServiceGift>
  ) { }
  async create(createDonationDto: CreateDonationDto, authenticatedUserId: string, authenticatedUserRole: UserRole) {
    const {
      userId,
      campaignId,
      serviceGiftId,
      amount,
      paymentStatus,
      paymentMethod,
    } = createDonationDto;

    // Find user
    const user = await this.userRep.findOne({
      where: {
        id: authenticatedUserRole === UserRole.ADMIN ? userId : authenticatedUserId,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    // Find campaign if campaignId was provided
    let campaign = null;

    if (campaignId) {
      campaign = await this.campaignRep.findOne({
        where: {
          id: campaignId,
        },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign Not Found');
      }
    }

    // Find service gift if serviceGiftId was provided
    let serviceGift = null;

    if (serviceGiftId) {
      serviceGift = await this.SerGifRep.findOne({
        where: {
          id: serviceGiftId,
        },
      });

      if (!serviceGift) {
        throw new NotFoundException('Service Gift Not Found');
      }
    }

    // Donation must have at least campaign OR service
    if (!campaignId && !serviceGiftId) {
      throw new BadRequestException(
        'Donation must have a campaign or service gift',
      );
    }

    // Create donation
    const donation = await this.donationRep.create({
      amount,
      paymentStatus,
      paymentMethod,
      user,
      campaign: campaign ?? undefined,
      ServiceGift: serviceGift ?? undefined,
    });

    const savedDonation = await this.donationRep.save(donation);

    // Only update campaign if this donation has a campaign
    if (campaign) {
      campaign.collectedAmount =
        Number(campaign.collectedAmount) + Number(amount);

      campaign.remainingAmount = Math.max(
        Number(campaign.goalAmount) - Number(campaign.collectedAmount),
        0,
      );

      await this.campaignRep.save(campaign);
    }

    return savedDonation;
  }

  findAll() {
    const donations = this.donationRep.find();
    return donations;
  }

  async myDonations(id: string) {

    const user = await this.donationRep.find({
      where: {
        user: {
          id: id
        },
      },
      relations: {
        campaign: true
      }
    });
    return user;
  }

  async findOne(id: string, authenticatedUserId: string, authenticatedUserRole: UserRole) {
    const donation = await this.donationRep.findOne({
      where: authenticatedUserRole === UserRole.ADMIN
        ? { id }
        : { id, user: { id: authenticatedUserId } },
      relations: {
        user: true,
        campaign: true,
      }
    });

    if (!donation) {
      throw new NotFoundException("Donation Not Found");
    }

    return donation
  }

  async update(id: string, updateDonationDto: UpdateDonationDto) {

    const donation = await this.donationRep.findOne({
      where: {
        id: String(id)
      }
    });

    if (!donation) {
      throw new NotFoundException(`Donation with this ${id} not found`)
    };

    donation.paymentStatus = updateDonationDto.paymentStatus;
    return await this.donationRep.save(donation);
  }

  async remove(id: string) {
    const donation = await this.donationRep.findOne({
      where: {
        id: String(id)
      }
    });

    if (!donation) {
      throw new NotFoundException(`Donation with this ${id} not found`)
    };

    await this.donationRep.delete(id)
    return {
      message: `campaign on ${id} is Deleted Successsfully`,
    };
  }
}
