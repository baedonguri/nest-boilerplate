import { Controller, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseEntity } from './base/base.entity.js';
import { BaseService } from './base/base.service.js';
import { TestHelper } from './test.helper.js';
import { Crud, CrudController, CrudOptions } from '../../src/lib/crud/index.js';

export function DynamicCrudModule(routeOption: CrudOptions['routes'], prefix = 'base', entity = BaseEntity) {
    function getController() {
        @Crud({ entity, routes: routeOption })
        @Controller(prefix)
        class BaseController implements CrudController<BaseEntity> {
            constructor(public readonly crudService: BaseService) {}
        }
        return BaseController;
    }

    function getModule() {
        @Module({
            imports: [forwardRef(() => TestHelper.getTypeOrmMysqlModule([BaseEntity])), TypeOrmModule.forFeature([BaseEntity])],
            controllers: [getController()],
            providers: [BaseService],
        })
        class BaseModule {}
        return BaseModule;
    }

    return getModule();
}
