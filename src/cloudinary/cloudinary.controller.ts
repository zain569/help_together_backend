import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    return this.cloudinaryService.uploadImage(file);
  }
}
