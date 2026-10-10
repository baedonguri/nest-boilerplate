import { Controller } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { ParamsRequestInterceptor } from './params.request.interceptor.js';
import { UpdateRequestDto } from './update-request.dto.js';
import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';
import { BaseEntity } from '../base/base.entity.js';
import { BaseService } from '../base/base.service.js';

@Crud({
    entity: BaseEntity,
    routes: {
        readOne: {
            interceptors: [ParamsRequestInterceptor],
            decorators: [ApiParam({ name: 'key', required: true })],
        },
        readMany: {
            interceptors: [ParamsRequestInterceptor],
            decorators: [ApiParam({ name: 'key', required: true })],
        },
        create: {
            interceptors: [ParamsRequestInterceptor],
            decorators: [ApiParam({ name: 'key', required: true })],
        },
        update: {
            swagger: {
                body: UpdateRequestDto,
            },
        },
    },
})
@Controller('swagger-decorator/:key')
export class SwaggerDecoratorController implements CrudController<BaseEntity> {
    constructor(public readonly crudService: BaseService) {}
}
