import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceGiftDto } from './dto/create-service-gift.dto.js';
import { UpdateServiceGiftDto } from './dto/update-service-gift.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceGift } from './entities/service-gift.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceGiftsService {
  constructor(
    @InjectRepository(ServiceGift)
    private readonly SerGifRep: Repository<ServiceGift>
  ) { }
  async create(createServiceGiftDto: CreateServiceGiftDto) {
    const gift = this.SerGifRep.create(createServiceGiftDto)
    const savedGift = await this.SerGifRep.save(gift)
    return savedGift;
  }

  async findAll() {
    const gifts = await this.SerGifRep.find({
      where: {
        isActive: true
      }
    })
    return gifts;
  }

  async findAllByadmin() {
    const gifts = await this.SerGifRep.find()
    return gifts;
  }

  async findOne(id: string) {
    const onegift = await this.SerGifRep.findOneBy({ id });
    if (!onegift) {
      throw new NotFoundException(`There is no Gift on this ID "${id}"`)
    }
    return onegift;
  }

  async update(id: string, updateServiceGiftDto: UpdateServiceGiftDto) {
    const gift = await this.SerGifRep.findOne({
      where: {
        id: id
      }
    });

    if (!gift) {
      throw new NotFoundException(`Gift & Service on this ${id} not exist`)
    }
    Object.assign(gift, updateServiceGiftDto);
    return await this.SerGifRep.save(gift);
  }

  async remove(id: string) {
    const gift = await this.SerGifRep.findOne({
      where: {
        id: id
      }
    });

    if (!gift) {
      throw new NotFoundException(`There is no gift And Cause on this ${id}`)
    };

    await this.SerGifRep.remove(gift);
    return {
      message: "The Gift & Cause Removed Successfully",
      title: gift.name
    };
  }
}
