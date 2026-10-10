import { Controller } from '@nestjs/common';

import { UserEntity } from './user.entity.js';
import { UserService } from './user.service.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';

@Crud({
    entity: UserEntity,
})
@Controller('user')
export class UserController implements CrudController<UserEntity> {
    constructor(public readonly crudService: UserService) {}
}
