import { Controller } from '@nestjs/common';

import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
    routes: {
        readOne: {
            softDelete: true,
        },
        readMany: {
            softDelete: true,
        },
        delete: {
            softDelete: true,
        },
    },
})
@Controller('soft-delete-and-get-soft-deleted')
export class SoftDeleteAndGetSoftDeletedController {
    constructor(public readonly crudService: BaseService) {}
}
