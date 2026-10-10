import { Controller } from '@nestjs/common';

import { DeleteRequestInterceptor } from './delete.request.interceptor.js';
import { ReadManyRequestInterceptor } from './read-many.request.interceptor.js';
import { ReadOneRequestInterceptor } from './read-one.request.interceptor.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
    routes: {
        readOne: {
            interceptors: [ReadOneRequestInterceptor],
        },
        readMany: {
            interceptors: [ReadManyRequestInterceptor],
        },
        delete: {
            interceptors: [DeleteRequestInterceptor],
        },
    },
})
@Controller('base')
export class RequestInterceptorController implements CrudController<BaseEntity> {
    constructor(public readonly crudService: BaseService) {}
}
