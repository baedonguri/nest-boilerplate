/** public API of the identity context — other modules may import only from here (checked by `pnpm lint:arch`) */
export { IdentityModule } from './identity.module.js';
export { default as authConfig } from './auth/config/auth.config.js';
export type { AuthConfig } from './auth/config/auth-config.type.js';
export type { JwtPayloadType } from './auth/strategies/types/jwt-payload.type.js';
export { RoleEnum } from './roles/roles.enum.js';
export { Roles } from './roles/roles.decorator.js';
export { RolesGuard } from './roles/roles.guard.js';
