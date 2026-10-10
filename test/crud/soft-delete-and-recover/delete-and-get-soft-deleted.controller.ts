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
            softDelete: false,
        },
    },
})
@Controller('delete-and-get-soft-deleted')
export class DeleteAndGetSoftDeletedController {
    constructor(public readonly crudService: BaseService) {}
}
