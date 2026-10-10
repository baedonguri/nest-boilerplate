import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MultiplePrimaryKeyController } from './multiple-primary-key.controller.js';
import { MultiplePrimaryKeyEntity } from './multiple-primary-key.entity.js';
import { MultiplePrimaryKeyService } from './multiple-primary-key.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([MultiplePrimaryKeyEntity])],
    controllers: [MultiplePrimaryKeyController],
    providers: [MultiplePrimaryKeyService],
})
export class MultiplePrimaryKeyModule {}
