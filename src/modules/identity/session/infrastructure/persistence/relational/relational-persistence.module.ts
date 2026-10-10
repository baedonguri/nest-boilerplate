import { Module } from '@nestjs/common';
import { SessionRepository } from '../session.repository.js';
import { SessionRelationalRepository } from './repositories/session.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionRelationalRepository,
    },
  ],
  exports: [SessionRepository],
})
export class RelationalSessionPersistenceModule {}
