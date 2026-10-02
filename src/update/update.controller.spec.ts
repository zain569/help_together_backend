import { Test, TestingModule } from '@nestjs/testing';
import { UpdateController } from './update.controller.js';
import { UpdateService } from './update.service.js';

describe('UpdateController', () => {
  let controller: UpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateController],
      providers: [UpdateService],
    }).compile();

    controller = module.get<UpdateController>(UpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
