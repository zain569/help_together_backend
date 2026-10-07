import { Module } from '@nestjs/common';
import { JazzcashService } from './jazzcash.service.js';
import { JazzcashController } from './jazzcash.controller.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [JazzcashController],
  providers: [JazzcashService],
  exports: [JazzcashService]
})
export class JazzcashModule { }
