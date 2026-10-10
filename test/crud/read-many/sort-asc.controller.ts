import { Controller } from '@nestjs/common';

import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController, Sort } from '../../../src/lib/crud/interface/index.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
    routes: { readMany: { sort: Sort.ASC } },
    logging: true,
})
@Controller('sort-asc')
export class SortAscController implements CrudController<BaseEntity> {
    constructor(public readonly crudService: BaseService) {}
}
