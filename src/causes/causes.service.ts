import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCauseDto } from './dto/create-cause.dto.js';
import { UpdateCauseDto } from './dto/update-cause.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CauseEntity } from './entities/cause.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class CausesService {
  constructor(
    @InjectRepository(CauseEntity)
    private readonly causeRep: Repository<CauseEntity>,
  ) { }

  //Create Cause
  async create(createCauseDto: CreateCauseDto) {
    const cause = this.causeRep.create(createCauseDto);

    return await this.causeRep.save(cause);
  }

  //Get All Causes
  async findAll() {
    const causes = await this.causeRep.find({
      where: {
        isActive: true,
      },
      order: {
        displayOrder: 'ASC'
      }
    })
    return causes;
  }

  //Get A Specific Cause
  async findOne(id: string) {
    const cause = await this.causeRep.findOne({
      where: {
        id: id
      }
    })

    if (!cause) {
      throw new NotFoundException('Cause Not Found')
    }
    return cause;
  }

  //Update A Cause
  async update(id: string, updateCauseDto: UpdateCauseDto) {
    const cause = await this.findOne(id);

    Object.assign(cause, updateCauseDto);

    return await this.causeRep.save(cause);
  }

  //Remove a Specific Cause
  async remove(id: string) {
    const cause = await this.findOne(id);

    await this.causeRep.remove(cause);
    return `Cause "${cause.name}" deleted successfully`;
  }
}
