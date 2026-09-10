import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignEntity } from './entities/campaign.entity.js';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly compainRep: Repository<CampaignEntity>
  ) { }
  async create(createCampaignDto: CreateCampaignDto) {
    const campaign = this.compainRep.create(createCampaignDto);

    const savedCampaign = await this.compainRep.save(campaign)
    return {
      campaign: savedCampaign
    };
  }

  async findAll() {
    const campaigns = await this.compainRep.find();
    return { campaigns };
  }

  async findOne(id: string) {
    const campaign = await this.compainRep.findOne({ where: {id: id } });
    return { campaign };
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
