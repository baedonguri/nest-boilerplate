import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller.js';

import { UsersService } from './users.service.js';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module.js';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
