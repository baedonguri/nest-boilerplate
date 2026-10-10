import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestInterceptorController } from './request-interceptor.controller.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [RequestInterceptorController],
    providers: [BaseService],
})
export class RequestInterceptorModule {}
