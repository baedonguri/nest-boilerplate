import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import type { INestApplication } from '@nestjs/common';

/** e2e harness: reset app_test, run migrations and seeds, then serve the app on APP_PORT for `request(APP_URL)` */
export default async function setup() {
  config({ path: '.env.test', override: true, quiet: true });

  const { AppDataSource } = await import('../src/database/data-source.js');
  await AppDataSource.initialize();
  await AppDataSource.dropDatabase();
  await AppDataSource.runMigrations();
  await AppDataSource.destroy();

  const { SeedModule } =
    await import('../src/database/seeds/relational/seed.module.js');
  const { RoleSeedService } =
    await import('../src/database/seeds/relational/role/role-seed.service.js');
  const { StatusSeedService } =
    await import('../src/database/seeds/relational/status/status-seed.service.js');
  const { UserSeedService } =
    await import('../src/database/seeds/relational/user/user-seed.service.js');
  const seed = await NestFactory.createApplicationContext(SeedModule, {
    logger: false,
  });
  await seed.get(RoleSeedService).run();
  await seed.get(StatusSeedService).run();
  await seed.get(UserSeedService).run();
  await seed.close();

  const { AppModule } = await import('../src/app.module.js');
  const { setupApp } = await import('../src/setup-app.js');
  const app: INestApplication = setupApp(
    await NestFactory.create(AppModule, { bufferLogs: true }),
  );
  await app.listen(Number(process.env.APP_PORT));

  return async () => {
    await app.close();
  };
}
