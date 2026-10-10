# Deployment

One container image serves the API and runs migrations. Configuration comes from environment variables at runtime; nothing secret is baked into the image.

## Build

```bash
docker build -t my-api .
```

The `Dockerfile` is multi-stage (build → production dependencies → runtime) on `node:24-slim`, runs as the non-root `node` user with `NODE_ENV=production`, and starts `node dist/main.js`.

## Release order

1. Build and push the image.
2. **Run migrations once**, with the same image and configuration, before rolling out:

   ```bash
   docker run --rm --env-file prod.env my-api \
     node node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js
   ```

   On Kubernetes use a Job (e.g. a Helm `pre-upgrade` hook); on other platforms a one-off task or a CI step. Stop the release if it fails.
3. Roll out the new image.

Do not run migrations on application start: TypeORM migrations take no lock, so several instances would race. Write migrations so the previous version keeps working — see [schema-change rules](database.md#schema-change-rules). Roll back by redeploying the previous image.

## Try it locally

```bash
docker compose --profile app up --build
```

`migrate` runs once, then `app` starts on port 3000 and reports healthy through the readiness probe.

## Configuration

| Variable | Default | Notes |
|---|---|---|
| `NODE_ENV` | `production` in the image | `development` · `production` · `test` |
| `APP_PORT` | `3000` | |
| `APP_NAME` | `app` | Also the PostgreSQL `application_name` |
| `API_PREFIX` | `api` | |
| `APP_CORS_ORIGINS` | `*` | Comma-separated origins |
| `LOG_LEVEL` | `info` | `fatal` · `error` · `warn` · `info` · `debug` · `trace` · `silent` |
| `DATABASE_*` | — | See [Database](database.md#configuration) |
| `AUTH_*` | — | See [Authentication](authentication.md#configuration) |

The app validates its configuration on start and exits if something required is missing. With `NODE_ENV=production` it also refuses the placeholder secrets from `.env.example`.

## Health checks

| Endpoint | Checks | Use as |
|---|---|---|
| `GET /api/health/live` | the process only | liveness probe (restart on failure) |
| `GET /api/health/ready` | database ping (1 s timeout) | readiness probe (stop routing traffic on failure) |

`GET /api/health` is an alias of `ready`. Liveness never checks the database, so a database outage takes instances out of rotation instead of restarting them all.

## Logs

- One JSON object per line (pino). Log level from `LOG_LEVEL`.
- Each request gets an id: an incoming `x-request-id` header is reused when it looks valid, otherwise a UUID is generated. The id is in every request log line and echoed in the `x-request-id` response header.
- `authorization`, `cookie` and `set-cookie` headers are redacted. Health-probe requests are not logged.

## Shutdown

On `SIGTERM` the app stops accepting connections, finishes in-flight requests and closes the database pool. Give the orchestrator a termination grace period of a few seconds.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests: lint, module boundaries, typecheck, unit, CRUD and e2e tests against a PostgreSQL service, build, and a container image build. Publishing the image to a registry is left to your deployment setup.

## Not included yet

- Metrics and distributed tracing. When you have a backend for them, add OpenTelemetry: load the SDK before the app with `node --import ./dist/instrument.js dist/main.js`, and register `@opentelemetry/instrumentation/hook.mjs` (this is an ESM app, so instrumentation needs the loader hook).
- Rate limiting on authentication routes.
