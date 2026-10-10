import { Controller } from '@nestjs/common';

import { BaseEntity } from './base.entity.js';
import { BaseService } from './base.service.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';

@Crud({
    entity: BaseEntity,
})
@Controller('base')
export class BaseController implements CrudController<BaseEntity> {
    constructor(public readonly crudService: BaseService) {}
}
