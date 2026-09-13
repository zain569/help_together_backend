import { Module } from '@nestjs/common';
import { CausesService } from './causes.service.js';
import { CausesController } from './causes.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CauseEntity } from './entities/cause.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CauseEntity])
  ],
  controllers: [CausesController],
  providers: [CausesService],
})
export class CausesModule { }
