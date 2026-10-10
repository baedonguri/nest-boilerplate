import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllConfigType } from './config/config.type.js';
import { setupApp } from './setup-app.js';

async function bootstrap() {
  const app = setupApp(
    await NestFactory.create(AppModule, { bufferLogs: true }),
  );
  const configService = app.get(ConfigService<AllConfigType>);
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
await bootstrap();
