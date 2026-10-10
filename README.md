# nest-boilerplate

A NestJS 12 starter for REST APIs: declare an entity and get CRUD routes, with email/JWT authentication and PostgreSQL ready to go.

## Features

- **Generated CRUD** — `@Crud({ entity })` builds list, read, search, create, update, delete and recover routes with validation and Swagger docs.
- **Authentication** — email sign-up/login, JWT access + rotating refresh tokens, per-device sessions, `admin`/`user` roles.
- **PostgreSQL + TypeORM** — migrations, seeds and a bounded connection pool.
- **Production basics** — Docker image, one-off migration step, JSON logs with request ids, liveness/readiness probes.
- **Guard rails** — Vitest unit and e2e suites, oxlint, and module-boundary checks, all wired into CI.

## Requirements

- Node.js 24 (`.nvmrc`), pnpm 10
- Docker (for PostgreSQL)

## Quick start

```bash
gh repo create my-api --template baedonguri/nest-boilerplate --private --clone && cd my-api
nvm use && pnpm install
docker compose up -d                # PostgreSQL on localhost:5433
cp .env.example .env
pnpm build && pnpm migration:run && pnpm seed:run
pnpm start:dev
```

- API: http://localhost:3000/api/v1
- Swagger UI: http://localhost:3000/docs
- Seeded accounts: `admin@example.com` / `secret` and `john.doe@example.com` / `secret`

## Scripts

| Command | Purpose |
|---|---|
| `pnpm start:dev` | Run with watch mode |
| `pnpm test` · `pnpm test:e2e` · `pnpm test:crud` | Unit · app e2e · CRUD library tests |
| `pnpm lint` · `pnpm lint:arch` · `pnpm typecheck` | Lint · module boundaries · types |
| `pnpm build` | Compile to `dist/` |
| `pnpm migration:generate src/database/migrations/<Name>` | Generate a migration from entity changes |
| `pnpm migration:run` · `pnpm seed:run` | Apply migrations · seed data |

## Documentation

- [Architecture](docs/architecture.md)
- [Adding a resource](docs/adding-a-resource.md)
- [CRUD reference](docs/crud.md)
- [Authentication](docs/authentication.md)
- [Database](docs/database.md)
- [Deployment](docs/deployment.md)
- [Testing](docs/testing.md)

## License

[MIT](LICENSE)
