import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseController } from './response-interceptor.controller.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [BaseController],
    providers: [BaseService],
})
export class BaseModule {}
