import { Controller } from '@nestjs/common';

import { MultiplePrimaryKeyEntity } from './multiple-primary-key.entity.js';
import { MultiplePrimaryKeyService } from './multiple-primary-key.service.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';

@Crud({
    entity: MultiplePrimaryKeyEntity,
})
@Controller('base')
export class MultiplePrimaryKeyController implements CrudController<MultiplePrimaryKeyEntity> {
    constructor(public readonly crudService: MultiplePrimaryKeyService) {}
}
