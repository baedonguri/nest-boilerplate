import { Controller, UseGuards } from '@nestjs/common';

import { AuthGuard } from './auth.guard.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
    routes: {
        readOne: {
            decorators: [UseGuards(AuthGuard)],
        },
        readMany: {
            decorators: [UseGuards(AuthGuard)],
        },
        create: {
            decorators: [UseGuards(AuthGuard)],
        },
        update: {
            decorators: [UseGuards(AuthGuard)],
        },
        delete: {
            decorators: [UseGuards(AuthGuard)],
        },
        upsert: {
            decorators: [UseGuards(AuthGuard)],
        },
        recover: {
            decorators: [UseGuards(AuthGuard)],
        },
        search: {
            decorators: [UseGuards(AuthGuard)],
        },
    },
})
@Controller('auth-guard')
export class AuthGuardController implements CrudController<BaseEntity> {
    constructor(public readonly crudService: BaseService) {}
}
