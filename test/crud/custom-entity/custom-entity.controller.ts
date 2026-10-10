import { Controller } from '@nestjs/common';

import { CustomEntity } from './custom-entity.entity.js';
import { CustomEntityService } from './custom-entity.service.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';

@Crud({
    entity: CustomEntity,
})
@Controller('base')
export class CustomEntityController implements CrudController<CustomEntity> {
    constructor(public readonly crudService: CustomEntityService) {}
}
