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

  async findOne(id: string) {
    const donation = await this.donationRep.findOne({
      where: {
        id: id,
      },
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

    const deleteddonation = await this.donationRep.delete(id)
    return {
      message: `campaign on ${id} is Deleted Successsfully`,
    };
  }
}
