import { Controller } from '@nestjs/common';

import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
})
@Controller('test')
export class ReservedNameController implements CrudController<BaseEntity> {
    constructor(public readonly crudService: BaseService) {}

    reservedReadOne() {
        return 'reservedMethodName';
    }
}
