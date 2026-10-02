import { Injectable } from '@nestjs/common';
import { CreateUpdateDto } from './dto/create-update.dto.js';
import { UpdateUpdateDto } from './dto/update-update.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Update } from './entities/update.entity.js';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(Update)
    private readonly updateRep: Repository<Update>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }
  async create(createUpdateDto: CreateUpdateDto, image: Express.Multer.File) {
    let imageUrl = createUpdateDto.imageUrl;

    if (image) {
      const result: any = await this.cloudinaryService.uploadImage(image);
      imageUrl = result.secure_url;
    }

    const update = this.updateRep.create({ ...createUpdateDto, imageUrl });
    const savedUpdate = await this.updateRep.save(update);
    return savedUpdate;
  }

  async findAll() {
    const updates = await this.updateRep.find();
    return updates;
  }

  async findOne(id: string) {
    const update = await this.updateRep.findOne({
      where: {
        id: id
      },
    });

    return update;
  }

  async update(id: string, updateUpdateDto: UpdateUpdateDto) {
    const update: any = await this.findOne(id);

    Object.assign(update, updateUpdateDto);

    return await this.updateRep.save(update);
  }

  async remove(id: string) {
    const update: any = await this.findOne(id);

    await this.updateRep.remove(update);
    return `Update of Name ${update.title} Deleted Successfully`;
  }
}
