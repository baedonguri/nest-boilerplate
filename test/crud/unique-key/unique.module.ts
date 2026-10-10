import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UniqueController } from './unique.controller.js';
import { UniqueEntity } from './unique.entity.js';
import { UniqueService } from './unique.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([UniqueEntity])],
    controllers: [UniqueController],
    providers: [UniqueService],
})
export class UniqueModule {}
