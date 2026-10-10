import { Controller, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepthOneEntity } from './depth-one.entity.js';
import { DepthOneService } from './depth-one.service.js';
import { DepthTwoEntity } from './depth-two.entity.js';
import { DepthTwoService } from './depth-two.service.js';
import { Crud, CrudController } from '../../../src/lib/crud/index.js';
import { TestHelper } from '../test.helper.js';

export function SubPathModule() {
    function depthOneController() {
        @Crud({ entity: DepthOneEntity })
        @Controller(':parentId/child')
        class DepthOneController implements CrudController<DepthOneEntity> {
            constructor(public readonly crudService: DepthOneService) {}
        }
        return DepthOneController;
    }

    function depthTwoController() {
        @Crud({ entity: DepthTwoEntity })
        @Controller(':parentId/sub/:subId/child')
        class DepthOneController implements CrudController<DepthTwoEntity> {
            constructor(public readonly crudService: DepthTwoService) {}
        }
        return DepthOneController;
    }

    function getModule() {
        @Module({
            imports: [
                forwardRef(() => TestHelper.getTypeOrmMysqlModule([DepthOneEntity, DepthTwoEntity])),
                TypeOrmModule.forFeature([DepthOneEntity, DepthTwoEntity]),
            ],
            controllers: [depthOneController(), depthTwoController()],
            providers: [DepthOneService, DepthTwoService],
        })
        class SubPathModule {}
        return SubPathModule;
    }
    return getModule();
}
