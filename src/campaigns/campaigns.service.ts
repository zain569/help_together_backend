import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CampaignEntity, compainStatus } from './entities/campaign.entity.js';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly compainRep: Repository<CampaignEntity>
  ) { }
  async create(createCampaignDto: CreateCampaignDto) {
    const campaign = this.compainRep.create({
      ...createCampaignDto,
      collectedAmount: 0,
      remainingAmount: createCampaignDto.goalAmount,
    });

    const savedCampaign = await this.compainRep.save(campaign)
    return {
      campaign: savedCampaign
    };
  }

  async findAll(page: number, limit: number) {
    const [campaigns, total] = await this.compainRep.findAndCount({
      skip: (page - 1) * limit,
      take: limit
    });
    return {
      campaigns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const campaign = await this.compainRep.findOne({ where: { id: id } });
    return { campaign };
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.compainRep.findOne({
      where: {
        id: id
      }
    })

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} is not found`)
    }

    Object.assign(campaign, updateCampaignDto);

    if (updateCampaignDto.goalAmount !== undefined) {
      campaign.remainingAmount = Math.max(
        Number(updateCampaignDto.goalAmount) - Number(campaign.collectedAmount),
        0,
      );
    }

    const savedCampaign = await this.compainRep.save(campaign);
    return savedCampaign;
  }

  async remove(id: string) {
    const campaign = await this.compainRep.findOne({
      where: { id: String(id) },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    await this.compainRep.delete(id);

    return {
      message: 'Campaign deleted successfully',
      id,
      title: campaign.title,
    };
  }

  async searchByTitle(title: string) {
    const campaigns = await this.compainRep.find({
      where: {
        title: ILike(`%${title}%`)
      }
    })
    return { campaigns };
  }

  async findByStatus(status: compainStatus) {
    return await this.compainRep.find({
      where: {
        status,
      },
    });
  }
}
