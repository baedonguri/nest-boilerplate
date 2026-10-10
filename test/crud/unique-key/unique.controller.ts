import { Controller } from '@nestjs/common';

import { UniqueEntity } from './unique.entity.js';
import { UniqueService } from './unique.service.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';

@Crud({
    entity: UniqueEntity,
})
@Controller('unique')
export class UniqueController implements CrudController<UniqueEntity> {
    constructor(public readonly crudService: UniqueService) {}
}
