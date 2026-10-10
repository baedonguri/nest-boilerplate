import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseController } from './base.controller.js';
import { BaseEntity } from './base.entity.js';
import { BaseService } from './base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [BaseController],
    providers: [BaseService],
})
export class BaseModule {}
