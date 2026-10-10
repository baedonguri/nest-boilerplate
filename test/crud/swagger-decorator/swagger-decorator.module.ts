import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SwaggerDecoratorController } from './swagger-decorator.controller.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [SwaggerDecoratorController],
    providers: [BaseService],
})
export class SwaggerDecoratorModule {}
