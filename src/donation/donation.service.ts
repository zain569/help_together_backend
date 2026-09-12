import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity.js';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity.js';
import { CampaignEntity } from '../campaigns/entities/campaign.entity.js';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(DonationEntity)
    private readonly donationRep: Repository<DonationEntity>,

    @InjectRepository(User)
    private readonly userRep: Repository<User>,

    @InjectRepository(CampaignEntity)
    private readonly campaignRep: Repository<CampaignEntity>,
  ) { }
  async create(createDonationDto: CreateDonationDto) {

    const { userId, campaignId, amount, paymentStatus, paymentMethod } = createDonationDto;

    const user = await this.userRep.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException("User Not Found")
    };

    const campaign = await this.campaignRep.findOne({
      where: { id: campaignId }
    })

    if (!campaign) {
      throw new NotFoundException("Campaign Not Found")
    };

    const donationData = {
      amount,
      paymentStatus,
      paymentMethod,
      user,
      campaign
    }

    const donation = this.donationRep.create(donationData)

    const savedDonation = await this.donationRep.save(donation)

    campaign.collectedAmount = Number(campaign.collectedAmount) + Number(amount);
    campaign.remainingAmount = Math.max(
      Number(campaign.goalAmount) - campaign.collectedAmount,
      0,
    );

    await this.campaignRep.save(campaign);

    return savedDonation;
  }

  findAll() {
    return `This action returns all donation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donation`;
  }

  update(id: number, updateDonationDto: UpdateDonationDto) {
    return `This action updates a #${id} donation`;
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}
