import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExcludeSwaggerController } from './exclude-swagger.controller.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [ExcludeSwaggerController],
    providers: [BaseService],
})
export class ExcludeSwaggerModule {}
