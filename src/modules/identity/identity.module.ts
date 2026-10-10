import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { SessionModule } from './session/session.module.js';
import { UsersModule } from './users/users.module.js';

/** entry point of the identity context (accounts, authentication, roles); other contexts import this module and ./index.ts only */
@Module({
  imports: [UsersModule, AuthModule, SessionModule],
})
export class IdentityModule {}
