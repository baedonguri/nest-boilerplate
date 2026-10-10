import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuardController } from './auth-guard.controller.js';
import { AuthGuard } from './auth.guard.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([BaseEntity])],
    controllers: [AuthGuardController],
    providers: [BaseService, AuthGuard],
})
export class AuthGuardModule {}
