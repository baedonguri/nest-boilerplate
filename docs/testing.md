# Testing

Vitest, with three suites. Start PostgreSQL first (`docker compose up -d`).

| Command | What | Where | Database |
|---|---|---|---|
| `pnpm test` | Unit tests | `src/**/*.spec.ts` | none |
| `pnpm test:e2e` | API end-to-end tests over HTTP | `test/**/*.e2e-spec.ts` | `app_test` |
| `pnpm test:crud` | CRUD library tests | `test/crud/**/*.spec.ts` | `crud_test` |

CI runs all three plus lint, module-boundary and type checks.

## App e2e tests

`test/global-setup.ts` prepares a clean environment before the suite:

1. loads `.env.test`
2. drops and recreates the `app_test` schema, then runs all migrations
3. runs the seeds (roles, statuses, `admin@example.com` and `john.doe@example.com`, password `secret`)
4. starts the app with the same global setup as production (`setup-app.ts`) on `APP_PORT` (3999)

Specs call the running server with `supertest`:

```ts
import request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants.js';

const { body } = await request(APP_URL)
  .post('/api/v1/auth/email/login')
  .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
  .expect(200);
```

Spec files share one database and run one after another, so create the data a test needs (e.g. register a fresh user with a unique email) instead of relying on order. `test/posts/posts.e2e-spec.ts` is a good template for a new resource.

## CRUD library tests

Each spec builds a small Nest app with its own entities and uses `synchronize` + `dropSchema` on `crud_test`, so files also run sequentially. Run them after changing anything in `src/lib/crud`.

## Notes

- `vitest.shared.ts` points `class-transformer` and `class-validator` at the same entry Node uses at runtime. Without it tests would load two copies and decorator metadata such as `@Exclude` (password hiding) would be ignored in tests only.
- Set `LOG_LEVEL=warn` (already in `.env.test`) to keep test output quiet.
