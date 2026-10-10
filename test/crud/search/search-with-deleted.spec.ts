import { Controller, HttpStatus, Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { IsOptional } from 'class-validator';
import request from 'supertest';
import { BaseEntity, Column, DeleteDateColumn, Entity, PrimaryColumn, Repository } from 'typeorm';

import { Crud } from '../../../src/lib/crud/crud.decorator.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';
import { CrudController } from '../../../src/lib/crud/interface/index.js';
import { TestHelper } from '../test.helper.js';

import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

/** `withDeleted: true` in a search body is only honored when the route opts in with `softDelete: true` */
@Entity('with_deleted_test')
class TestEntity extends BaseEntity {
    @PrimaryColumn()
    @IsOptional({ always: true })
    col1: number;

    @Column({ nullable: true })
    @IsOptional({ always: true })
    name: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}

@Injectable()
class TestService extends CrudService<TestEntity> {
    constructor(@InjectRepository(TestEntity) repository: Repository<TestEntity>) {
        super(repository);
    }
}

@Crud({ entity: TestEntity })
@Controller('default')
class DefaultController implements CrudController<TestEntity> {
    constructor(public readonly crudService: TestService) {}
}

@Crud({ entity: TestEntity, routes: { search: { softDelete: true } } })
@Controller('opt-in')
class OptInController implements CrudController<TestEntity> {
    constructor(public readonly crudService: TestService) {}
}

@Module({
    imports: [TypeOrmModule.forFeature([TestEntity])],
    controllers: [DefaultController, OptInController],
    providers: [TestService],
})
class TestModule {}

describe('Search withDeleted', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestModule, TestHelper.getTypeOrmPgsqlModule([TestEntity])],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();

        await request(app.getHttpServer()).post('/default').send({ col1: 1, name: 'alive' }).expect(HttpStatus.CREATED);
        await request(app.getHttpServer()).post('/default').send({ col1: 2, name: 'deleted' }).expect(HttpStatus.CREATED);
        await request(app.getHttpServer()).delete('/default/2').expect(HttpStatus.OK);
    });

    afterAll(async () => {
        await TestHelper.dropTypeOrmEntityTables();
        await app?.close();
    });

    it('rejects withDeleted: true when the route does not opt in', async () => {
        await request(app.getHttpServer()).post('/default/search').send({ withDeleted: true }).expect(HttpStatus.UNPROCESSABLE_ENTITY);

        const { body } = await request(app.getHttpServer()).post('/default/search').send({ withDeleted: false }).expect(HttpStatus.OK);
        expect(body.data.map(({ col1 }: TestEntity) => col1)).toEqual([1]);
    });

    it('rejects withDeleted smuggled through a forged nextCursor', async () => {
        const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64');
        const nextCursor = encode({ where: encode({ withDeleted: true }), nextCursor: encode({}), total: 2 });

        await request(app.getHttpServer()).post('/default/search').send({ nextCursor }).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('includes soft-deleted rows when the route opts in with softDelete: true', async () => {
        const { body } = await request(app.getHttpServer()).post('/opt-in/search').send({ withDeleted: true }).expect(HttpStatus.OK);
        expect(body.data.map(({ col1 }: TestEntity) => col1).sort()).toEqual([1, 2]);
    });
});
