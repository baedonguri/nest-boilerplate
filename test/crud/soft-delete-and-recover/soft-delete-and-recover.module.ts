import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeleteAndGetSoftDeletedController } from './delete-and-get-soft-deleted.controller.js';
import { DeleteAndIgnoreSoftDeletedController } from './delete-and-ignore-soft-deleted.controller.js';
import { SoftDeleteAndGetSoftDeletedController } from './soft-delete-and-get-soft-deleted.controller.js';
import { SoftDeleteAndIgnoreSoftDeletedController } from './soft-delete-and-ignore-soft-deleted.controller.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [
        SoftDeleteAndGetSoftDeletedController,
        SoftDeleteAndIgnoreSoftDeletedController,
        DeleteAndGetSoftDeletedController,
        DeleteAndIgnoreSoftDeletedController,
    ],
    providers: [BaseService],
})
export class SoftDeleteAndRecoverModule {}
