import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service.js';
import { SeedModule } from './seed.module.js';
import { StatusSeedService } from './status/status-seed.service.js';
import { UserSeedService } from './user/user-seed.service.js';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();

  await app.close();
};

void runSeed();
