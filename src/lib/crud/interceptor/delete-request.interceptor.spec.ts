import { of } from 'rxjs';
import { BaseEntity } from 'typeorm';

import { DeleteRequestInterceptor } from './delete-request.interceptor.js';
import { CRUD_ROUTE_ARGS } from '../constants.js';
import { ExecutionContextHost } from '../provider/index.js';
import { CrudLogger } from '../provider/crud-logger.js';

import type { CallHandler } from '@nestjs/common';

describe('DeleteRequestInterceptor', () => {
    it('should intercept', async () => {
        class BodyDto extends BaseEntity {
            col1: string;
        }
        const Interceptor = DeleteRequestInterceptor({ entity: BodyDto }, { relations: [], logger: new CrudLogger(), primaryKeys: [] });
        const interceptor = new Interceptor();

        const handler: CallHandler = {
            handle: () => of('test'),
        };
        const context = new ExecutionContextHost([{}]);
        await interceptor.intercept(context, handler);
        expect(context.switchToHttp().getRequest()).toHaveProperty(CRUD_ROUTE_ARGS);
    });
});
