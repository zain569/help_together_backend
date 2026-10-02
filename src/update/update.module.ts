import { Module } from '@nestjs/common';
import { UpdateService } from './update.service.js';
import { UpdateController } from './update.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Update } from './entities/update.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Update]),
    AuthModule,
    CloudinaryModule
  ],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule { }
