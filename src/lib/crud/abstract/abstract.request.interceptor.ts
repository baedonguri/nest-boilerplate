import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import _ from 'lodash';

import { CreateParamsDto } from '../dto/params.dto.js';
import { GROUP } from '../interface/index.js';

import type { Author, Column, CrudOptions, EntityType, Method } from '../interface/index.js';
import type { CrudLogger } from '../provider/crud-logger.js';
import type { Request } from 'express';

export abstract class RequestAbstractInterceptor {
    constructor(public readonly crudLogger: CrudLogger) {}

    async checkParams(
        entity: EntityType,
        params: Record<string, string>,
        factoryColumns: Column[] = [],
        exception = new NotFoundException(),
    ): Promise<Partial<Record<keyof EntityType, unknown>>> {
        if (_.isNil(params)) {
            return {};
        }
        const columns = factoryColumns.map(({ name }) => name);
        const paramsKey = Object.keys(params);
        const invalidColumns = _.difference(paramsKey, columns);
        if (invalidColumns.length > 0) {
            this.crudLogger.log(`Invalid query params: ${invalidColumns.toLocaleString()}`);
            throw exception;
        }
        const transformed = plainToInstance(CreateParamsDto(entity, paramsKey as unknown as Array<keyof EntityType>), params);
        const errorList = await validate(transformed, { groups: [GROUP.PARAMS], forbidUnknownValues: false });
        if (errorList.length > 0) {
            this.crudLogger.log(errorList, 'ValidationError');
            throw exception;
        }
        return Object.assign({}, transformed);
    }

    getAuthor(
        request: Request | Record<string, unknown>,
        crudOptions: CrudOptions,
        method: Exclude<Method, Method.READ_MANY | Method.READ_ONE | Method.SEARCH>,
    ): Author | undefined {
        const author = crudOptions.routes?.[method]?.author;

        if (!author) {
            return;
        }

        return { ...author, value: author.value ?? _.get(request, author.filter ?? '', author.value) };
    }
}
