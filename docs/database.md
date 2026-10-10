# Database

PostgreSQL through TypeORM. Data source and settings: `src/database`.

## Local database

`docker compose up -d` starts PostgreSQL 18 on **localhost:5433** with three databases:

| Database | Used by |
|---|---|
| `app_dev` | `pnpm start:dev` (`.env`) |
| `app_test` | `pnpm test:e2e` (`.env.test`) |
| `crud_test` | `pnpm test:crud` (`test/crud/.env.test`) |

Change the host port with `DATABASE_PORT` in `.env` (it is read by both the app and docker compose).

## Entities

Every entity must be listed in `src/database/entities.ts`. The app, the seeds and the migration CLI all use this list. `synchronize` stays off; the schema changes only through migrations.

## Migrations

The migration CLI runs against the compiled output, so build first:

```bash
pnpm build
pnpm migration:generate src/database/migrations/AddNoteTags   # diff between entities and the database
# add the generated class to src/database/migrations/index.ts (run order)
pnpm build && pnpm migration:run
pnpm migration:revert                                          # development only
```

Running `migration:generate` again right after `migration:run` should report "No changes" — a quick check that entities and migrations agree.

### Schema-change rules

Deployments roll forward while the previous version may still be running, so every migration must be safe for the previous app version:

1. In one release, only add (tables, nullable columns, indexes).
2. Rename, drop, add `NOT NULL` or change a type over two or more releases: add the new column → write to both → backfill → remove the old column.
3. Run large backfills separately from schema migrations.
4. Roll back by deploying the previous image. The database only moves forward.
5. Never edit a migration that has been deployed; TypeORM tracks migrations by name.
6. For `CREATE INDEX CONCURRENTLY`, set `transaction = false` on the migration and run the CLI with `--transaction each`.

## Seeds

`pnpm seed:run` (after `pnpm build`) inserts roles, statuses and two accounts (`admin@example.com`, `john.doe@example.com`, password `secret`). Seeds are idempotent reference data for development; they are not part of deployments.

## Connection pool

Each app instance keeps at most `DATABASE_POOL_MAX` connections (default **10**). Keep the total within the server limit:

```
(instances + extra instances during a rolling deploy) × DATABASE_POOL_MAX + migrations/admin (~5)
    ≤ max_connections − reserved (3)
```

With PostgreSQL's default `max_connections` of 100 and a pool of 10, that is 4 instances normally (8 while deploying). The pool also waits at most 5 s for a free connection and closes idle connections after 10 s.

- Set server-side limits such as `statement_timeout` and `idle_in_transaction_session_timeout` on the database role (`ALTER ROLE … SET`) or the managed database's parameter group, not in the app connection options.
- When instances × pool approaches the limit, or with autoscaling, put a pooler in front (a managed proxy, or PgBouncer in transaction mode). Then run migrations against the database directly, and do not use `LISTEN/NOTIFY` or session advisory locks through the pooler.

## Configuration

| Variable | Default | Notes |
|---|---|---|
| `DATABASE_HOST` · `DATABASE_PORT` · `DATABASE_NAME` · `DATABASE_USERNAME` · `DATABASE_PASSWORD` | — | Or `DATABASE_URL` instead |
| `DATABASE_TYPE` | — | `postgres` |
| `DATABASE_POOL_MAX` | `10` | Connections per app instance |
| `DATABASE_SYNCHRONIZE` | `false` | Keep `false`; use migrations |
| `DATABASE_SSL_ENABLED` · `DATABASE_REJECT_UNAUTHORIZED` · `DATABASE_CA` · `DATABASE_KEY` · `DATABASE_CERT` | `false` | TLS to the database |
