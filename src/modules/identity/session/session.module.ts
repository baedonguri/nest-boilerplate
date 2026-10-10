import {
  // common
  Module,
} from '@nestjs/common';

import { RelationalSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module.js';
import { SessionService } from './session.service.js';

const infrastructurePersistenceModule = RelationalSessionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}
