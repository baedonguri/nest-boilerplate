import { Test } from '@nestjs/testing';

import { BaseController } from './base.controller.js';
import { BaseEntity } from './base.entity.js';
import { BaseModule } from './base.module.js';
import { BaseService } from './base.service.js';
import { TestHelper } from '../test.helper.js';

import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('BaseController', () => {
    let app: INestApplication;
    let controller: BaseController;
    let service: BaseService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [BaseModule, TestHelper.getTypeOrmMysqlModule([BaseEntity])],
        }).compile();
        app = moduleFixture.createNestApplication();

        controller = moduleFixture.get<BaseController>(BaseController);
        service = moduleFixture.get<BaseService>(BaseService);
        await service.repository.save(['name1', 'name2'].map((name: string) => service.repository.create({ name })));

        await app.init();
    });

    afterAll(async () => {
        await TestHelper.dropTypeOrmEntityTables();
        await app?.close();
    });

    it('dynamic method on controller', async () => {
        const controllerPrototype = Object.getPrototypeOf(Object.getPrototypeOf(controller));
        const propertyNames = Object.getOwnPropertyNames(controllerPrototype).filter((name) => name !== 'constructor');

        const expectedMethods = [
            'reservedReadOne',
            'reservedReadMany',
            'reservedCreate',
            'reservedUpdate',
            'reservedUpsert',
            'reservedDelete',
            'reservedRecover',
            'reservedSearch',
        ];

        expect(propertyNames).toHaveLength(expectedMethods.length);
        expect(propertyNames).toEqual(expect.arrayContaining(expectedMethods));
    });
});
