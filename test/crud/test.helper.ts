import { ApplicationConfig } from '@nestjs/core';
import { ModelPropertiesAccessor } from './swagger-internals.js';
import { SchemaObjectFactory } from './swagger-internals.js';
import { SwaggerTypesMapper } from './swagger-internals.js';
import { SwaggerExplorer } from './swagger-internals.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import type { DenormalizedDoc } from './swagger-internals.js';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { BaseEntity } from 'typeorm';

export class TestHelper {
    static getRoutePath(httpServer: any): Record<string, string[]> {
        return httpServer._events.request.router.stack.reduce(
            (list: Record<string, string[]>, r: { route: { path: string; methods: { method: unknown } } }) => {
                if (r.route?.path) {
                    for (const method of Object.keys(r.route.methods)) {
                        list[method] = list[method] ?? [];
                        list[method].push(r.route.path);
                    }
                }
                return list;
            },
            {},
        );
    }

    static async dropTypeOrmEntityTables() {
        let failCount = 0;
        const metadata = getMetadataArgsStorage();
        const tables = [...metadata.tables];
        while (tables.length > 0) {
            const table = tables.shift()!;
            if (!table.name) {
                return;
            }
            const entity = table.target as typeof BaseEntity;
            if (!entity.query) {
                return;
            }
            await entity.query(`DROP TABLE ${table.name}`).catch((error) => {
                if (failCount++ > 10) {
                    throw error;
                }
                tables.push(table);
            });
        }
    }

    /** PostgreSQL only: specs that ask for a MySQL connection run on PostgreSQL */
    static getTypeOrmMysqlModule(entities: TypeOrmModuleOptions['entities']) {
        return TestHelper.getTypeOrmPgsqlModule(entities);
    }

    static getTypeOrmPgsqlModule(entities: TypeOrmModuleOptions['entities'], namingStrategy?: TypeOrmModuleOptions['namingStrategy']) {
        return TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRESQL_DATABASE_HOST,
            port: Number(process.env.POSTGRESQL_DATABASE_PORT ?? 5432),
            database: process.env.POSTGRESQL_DATABASE_NAME,
            username: process.env.POSTGRESQL_DATABASE_USERNAME,
            password: process.env.POSTGRESQL_DATABASE_PASSWORD,
            entities,
            synchronize: true,
            logging: true,
            logger: 'file',
            namingStrategy,
            dropSchema: true,
        });
    }

    static async getTypeOrmMongoModule(url: string, entities: TypeOrmModuleOptions['entities']) {
        return TypeOrmModule.forRoot({
            type: 'mongodb',
            url,
            entities,
            logging: true,
            logger: 'file',
            dropSchema: true,
        });
    }

    static getSwaggerExplorer(wrapper: InstanceWrapper<object>): Record<string, DenormalizedDoc> {
        const schemaObjectFactory = new SchemaObjectFactory(new ModelPropertiesAccessor(), new SwaggerTypesMapper());
        const explorer = new SwaggerExplorer(schemaObjectFactory);
        const routes = explorer.exploreController(wrapper, new ApplicationConfig(), {});
        return routes.reduce(
            (summary, route) => {
                if (!route.root?.operationId) {
                    return summary;
                }
                summary[`${route.root.method} ${route.root.path}`] = route;
                return summary;
            },
            {} as Record<string, DenormalizedDoc>,
        );
    }
}
