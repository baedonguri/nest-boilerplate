# Authentication

Email/password accounts with JWT access tokens and rotating refresh tokens. Code: `src/modules/identity`.

## Endpoints

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/v1/auth/email/register` | — | Create an account (`email`, `password`, `firstName`, `lastName`). 204 |
| `POST /api/v1/auth/email/login` | — | Returns `{ token, refreshToken, tokenExpires, user }` |
| `POST /api/v1/auth/refresh` | refresh token | Returns a new token pair; the old refresh token stops working |
| `POST /api/v1/auth/logout` | access token | Ends the current session. 204 |
| `GET /api/v1/auth/me` | access token | Current user |
| `PATCH /api/v1/auth/me` | access token | Update name or password (`password` needs `oldPassword`) |
| `DELETE /api/v1/auth/me` | access token | Soft-delete the account. 204 |
| `/api/v1/users` (`GET`, `POST`, `GET/PATCH/DELETE :id`) | access token, `admin` role | User management. List: `?page=1&limit=10` (max 50), `filters={"roles":[{"id":1}]}`, `sort=[{"orderBy":"id","order":"DESC"}]` |

Send tokens as `Authorization: Bearer <token>`. For `/auth/refresh`, the bearer token is the refresh token.

## Tokens and sessions

- **Access token**: short-lived JWT (`AUTH_JWT_TOKEN_EXPIRES_IN`, default `15m`) carrying `{ id, role, sessionId }`. It is verified without a database lookup.
- **Refresh token**: longer-lived JWT (`AUTH_REFRESH_TOKEN_EXPIRES_IN`, default `30d`) tied to a row in `session`. Each refresh swaps the session hash, so a refresh token works once.
- **Sessions**: one per login, so several devices can be signed in. Logout deletes the session; changing your password ends your other sessions.
- Because access tokens are not checked against the database, logout, account deletion and role changes take effect when the current access token expires. Keep the access token lifetime short.

## Protecting routes

```ts
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard, RoleEnum, type JwtPayloadType } from '../identity/index.js';

@UseGuards(AuthGuard('jwt'))                       // any signed-in user; req.user is JwtPayloadType
@Get('mine') mine(@Request() req: { user: JwtPayloadType }) { ... }

@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)           // admins only
@Get('admin-only') adminOnly() { ... }
```

With `@Crud`, pass the same guards through route `decorators` (see [CRUD reference](crud.md#options)).

Roles and statuses are reference tables seeded by `pnpm seed:run`: roles `admin` (1) and `user` (2); statuses `active` (1) and `inactive` (2). New accounts are `user` and `active`.

## Configuration

| Variable | Default | Notes |
|---|---|---|
| `AUTH_JWT_SECRET` | — | Required. Production refuses the placeholder from `.env.example` |
| `AUTH_JWT_TOKEN_EXPIRES_IN` | — | Required, e.g. `15m` |
| `AUTH_REFRESH_SECRET` | — | Required, must differ from the access secret |
| `AUTH_REFRESH_TOKEN_EXPIRES_IN` | — | Required, e.g. `30d` |
| `AUTH_UNIFORM_ERRORS` | `false` | `true` returns the same login error for unknown email and wrong password (hides which accounts exist) |

## Not included

- Email confirmation, password reset and email change — they need a mail service.
- Social login.
- Login rate limiting — add `@nestjs/throttler` (or a gateway rule) before going to production.
