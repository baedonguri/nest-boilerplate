import { mixin } from '@nestjs/common';

import { RequestAbstractInterceptor } from '../abstract/index.js';
import { CRUD_ROUTE_ARGS, CUSTOM_REQUEST_OPTIONS } from '../constants.js';
import { Method } from '../interface/index.js';

import type { CrudOptions, CrudRecoverRequest, FactoryOption } from '../interface/index.js';
import type { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';

const method = Method.RECOVER;
export function RecoverRequestInterceptor(crudOptions: CrudOptions, factoryOption: FactoryOption): Type<NestInterceptor> {
    class MixinInterceptor extends RequestAbstractInterceptor implements NestInterceptor {
        constructor() {
            super(factoryOption.logger);
        }

        async intercept(context: ExecutionContext, next: CallHandler<unknown>): Promise<Observable<unknown>> {
            const req: Record<string, any> = context.switchToHttp().getRequest<Request>();
            const recoverOptions = crudOptions.routes?.[method] ?? {};

            const customRequestOption = req[CUSTOM_REQUEST_OPTIONS];
            const params = await this.checkParams(crudOptions.entity, customRequestOption?.params ?? req.params, factoryOption.columns);
            const crudRecoverRequest: CrudRecoverRequest<typeof crudOptions.entity> = {
                params,
                author: this.getAuthor(req, crudOptions, method),
                exclude: new Set(recoverOptions.exclude ?? []),
                saveOptions: {
                    listeners: recoverOptions.listeners,
                },
            };

            this.crudLogger.logRequest(req, crudRecoverRequest);
            req[CRUD_ROUTE_ARGS] = crudRecoverRequest;
            return next.handle();
        }
    }

    return mixin(MixinInterceptor);
}
