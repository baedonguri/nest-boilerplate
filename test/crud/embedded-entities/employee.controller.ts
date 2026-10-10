import { Controller } from '@nestjs/common';

import { EmployeeEntity } from './employee.entity.js';
import { EmployeeService } from './employee.service.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';

@Crud({
    entity: EmployeeEntity,
})
@Controller('employee')
export class EmployeeController implements CrudController<EmployeeEntity> {
    constructor(public readonly crudService: EmployeeService) {}
}
