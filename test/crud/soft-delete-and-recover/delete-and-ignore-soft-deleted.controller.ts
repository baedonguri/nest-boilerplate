import { Controller } from '@nestjs/common';

import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
    routes: {
        readOne: {
            softDelete: false,
        },
        readMany: {
            softDelete: false,
        },
        delete: {
            softDelete: false,
        },
    },
})
@Controller('delete-and-ignore-soft-deleted')
export class DeleteAndIgnoreSoftDeletedController {
    constructor(public readonly crudService: BaseService) {}
}
