import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { LoggingModule } from './common/logging/logger.module.js';
import appConfig from './config/app.config.js';
import databaseConfig from './database/config/database.config.js';
import { TypeOrmConfigService } from './database/typeorm-config.service.js';
import { HealthModule } from './modules/health/health.module.js';
import { PostsModule } from './modules/posts/posts.module.js';
import { authConfig, IdentityModule } from './modules/identity/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options?: DataSourceOptions) => {
        return new DataSource(options!).initialize();
      },
    }),
    LoggingModule,
    IdentityModule,
    HealthModule,
    PostsModule,
  ],
})
export class AppModule {}
