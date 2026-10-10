# Architecture

A modular monolith: one NestJS application split into business modules with explicit boundaries, plus a self-contained CRUD library.

## Layout

```
src/
  main.ts · app.module.ts
  setup-app.ts          global setup shared by main.ts and the e2e harness
  modules/              business modules — add new resources here
    identity/           accounts and authentication: auth · users · session · roles · statuses
      index.ts          public API of the module
    posts/              sample @Crud resource
    health/             liveness / readiness probes
  common/               shared kernel: logging, serialization and validation setup, shared types
  config/               app configuration and environment validation
  database/             data source, entity list, migrations, seeds
  lib/crud/             generic CRUD library (@Crud decorator, CrudService)
test/
  crud/                 CRUD library tests
  admin/ user/ posts/ health/   app e2e tests
```

## Request pipeline

`setup-app.ts` configures every request the same way in production and in e2e tests:

- global prefix `api` and URI versioning (`/api/v1/...`)
- `ValidationPipe` with whitelisting; validation errors return **422**
- `ClassSerializerInterceptor` (fields marked `@Exclude` never leave the server)
- Helmet, CORS (`APP_CORS_ORIGINS`), Swagger at `/docs`
- JSON request logging with a request id (see [Deployment](deployment.md#logs))

## Module boundaries

Rules enforced by `pnpm lint:arch` (dependency-cruiser) in CI:

1. **Use other modules only through their public API** — `src/modules/<name>/index.ts`. Importing another module's internal files fails the check.
2. **Reference other modules' data by id.** Do not create TypeORM relations across modules. When you need database integrity, declare the foreign key by table name so no class is imported:

   ```ts
   @ForeignKey('user', 'id', { onDelete: 'CASCADE' })
   @Column({ type: 'integer' })
   authorId: number;
   ```

3. **`common/` is a shared kernel** — context-free code only; it never imports business modules.
4. **`lib/crud` is self-contained** — it never imports application code.

Composition roots are exempt: `app.module.ts`, `config/`, `database/` (entity list, seeds, migrations), `setup-app.ts` and `test/`.

The identity module exposes `IdentityModule`, `authConfig` / `AuthConfig`, `JwtPayloadType`, `RoleEnum`, `Roles` and `RolesGuard`. Add an `index.ts` to a new module only when other modules need something from it.

## Two ways to build a resource

| Style | Use it for | How | Example |
|---|---|---|---|
| `@Crud` | Data-centric resources with little business logic: content, reference data, admin lists | Entity + `CrudService` + `@Crud` controller; validation groups on the entity decide which fields each route accepts | `modules/posts` |
| Layered | Resources with business rules, state transitions or several stores | Domain class → entity → mapper → repository port and implementation; service; explicit DTOs | `modules/identity/users` |

`@Crud` is fast but ties the API contract to the database schema. When that starts to hurt, move the resource to the layered style.

Rules for `@Crud` resources:

- Set `relations` explicitly on read routes — the library joins every relation by default.
- Use offset pagination with a `limitOfTake` cap on list routes.
- Reference other modules by id (rule 2 above).
- Put authentication on routes with `decorators` (guards) and ownership checks with `interceptors`.

See [Adding a resource](adding-a-resource.md) and [CRUD reference](crud.md).
