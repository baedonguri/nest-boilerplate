import { Controller } from '@nestjs/common';

import { ResponseCustomInterceptor } from './response-custom.interceptor.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
    routes: {
        readOne: {
            interceptors: [ResponseCustomInterceptor],
        },
        readMany: {
            interceptors: [ResponseCustomInterceptor],
        },
        create: {
            interceptors: [ResponseCustomInterceptor],
        },
        delete: {
            interceptors: [ResponseCustomInterceptor],
        },
        recover: {
            interceptors: [ResponseCustomInterceptor],
        },
        update: {
            interceptors: [ResponseCustomInterceptor],
        },
        upsert: {
            interceptors: [ResponseCustomInterceptor],
        },
    },
})
@Controller('base')
export class BaseController implements CrudController<BaseEntity> {
    constructor(public readonly crudService: BaseService) {}
}
