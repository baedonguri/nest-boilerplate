import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomEntityController } from './custom-entity.controller.js';
import { CustomEntity } from './custom-entity.entity.js';
import { CustomEntityService } from './custom-entity.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([CustomEntity])],
    controllers: [CustomEntityController],
    providers: [CustomEntityService],
})
export class CustomEntityModule {}
