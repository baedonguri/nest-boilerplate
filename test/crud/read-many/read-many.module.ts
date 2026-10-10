import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NumberOfTakeController } from './number-of-take.controller.js';
import { SortAscController } from './sort-asc.controller.js';
import { SortDescController } from './sort-desc.controller.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [SortAscController, SortDescController, NumberOfTakeController],
    providers: [BaseService],
})
export class ReadManyModule {}
