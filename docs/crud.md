# CRUD reference

`@Crud({ entity })` on a controller generates routes backed by a `CrudService<T>`. The library lives in `src/lib/crud`; its own tests are in `test/crud` (`pnpm test:crud`).

## Generated routes

For `@Controller({ path: 'notes', version: '1' })`:

| Method key | HTTP | Success | Notes |
|---|---|---|---|
| `readOne` | `GET /api/v1/notes/:id` | 200 | `?fields=title&fields=createdAt` selects columns |
| `readMany` | `GET /api/v1/notes` | 200 | query-string filters on `READ_MANY` fields, pagination |
| `search` | `POST /api/v1/notes/search` | 200 | filter/sort/select in the body |
| `create` | `POST /api/v1/notes` | 201 | body is one object or an array |
| `update` | `PATCH /api/v1/notes/:id` | 200 | partial body (`UPDATE` fields) |
| `upsert` | `PUT /api/v1/notes/:id` | 200 | creates or updates by params |
| `delete` | `DELETE /api/v1/notes/:id` | 200 | soft delete by default (needs a `@DeleteDateColumn`); `softDelete: false` for hard delete |
| `recover` | `POST /api/v1/notes/:id/recover` | 201 | restores a soft-deleted row |

Generate only what you need with `only: [Method.READ_ONE, ...]`. You can add normal `@Get()`/`@Post()` handlers to the same controller for anything custom.

## Validation groups

Fields are accepted per route through class-validator `groups` on the entity: `GROUP.CREATE`, `GROUP.UPDATE`, `GROUP.UPSERT`, `GROUP.READ_MANY` (query filters), `GROUP.SEARCH` (search `where`), `GROUP.PARAMS` (path params). Unknown or out-of-group fields return **422** with the class-validator error list.

## Pagination

Offset (recommended, set `paginationType: 'offset'`):

```
GET /api/v1/notes?limit=20&offset=40
→ { "data": [...], "metadata": { "page": 3, "pages": 5, "total": 98, "offset": 60, "nextCursor": "..." } }
```

- `metadata.offset` is the offset of the next page.
- `limitOfTake` caps `limit` (422 above it). Without it there is no cap.

Cursor (library default): the response carries `metadata.nextCursor`; send it back as `?nextCursor=...` (or in the search body) for the next page. Page size is `numberOfTake`.

## Search

```json
POST /api/v1/notes/search
{
  "where": [{ "title": { "operator": "ILIKE", "operand": "%nest%" } }],
  "order": { "createdAt": "DESC" },
  "select": ["id", "title"],
  "limit": 20,
  "offset": 0
}
```

- Each object in `where` is AND-ed; the array items are OR-ed. Add `"not": true` to negate.
- Operators: `=` `!=` `>` `>=` `<` `<=` `LIKE` `ILIKE` `IN` `BETWEEN` `NULL`, and PostgreSQL JSON `?` `@>`.
- `where` fields must be in the `SEARCH` group.
- `withDeleted: true` is accepted only when the route sets `softDelete: true`; otherwise 422.

## Options

Top level: `entity`, `only`, `routes`, `logging`.

Every route (`routes.<method>`):

| Option | Purpose |
|---|---|
| `decorators` | Method decorators such as `UseGuards(AuthGuard('jwt'))`, `ApiBearerAuth()` |
| `interceptors` | Interceptor classes run before the route (e.g. ownership checks) |
| `exclude` | Entity keys removed from the response |
| `swagger` | `{ hide, response, body }` to adjust the generated docs |

Per route:

| Route | Options |
|---|---|
| `readOne` | `params`, `relations`, `softDelete` |
| `readMany` | `paginationType`, `numberOfTake`, `limitOfTake`, `sort` (`ASC`/`DESC`), `paginationKeys`, `relations`, `softDelete` |
| `search` | `paginationType`, `numberOfTake`, `limitOfTake`, `paginationKeys`, `relations`, `softDelete` |
| `create` | `author`, `listeners` |
| `update` · `upsert` | `params`, `author`, `listeners` |
| `delete` | `params`, `softDelete` (default `true`), `author` |
| `recover` | `params`, `author` |

- `relations`: `false` or a list such as `['category']`. **Default: every relation is joined** — always set it.
- `author`: `{ property, filter }` copies a value from the request (e.g. `filter: 'user.id'` from the JWT) into an entity column.
- `params`: path parameter names other than the primary key (e.g. `['slug']`).

Per-request control: extend `CustomRequestInterceptor` and override `overrideOptions(req)` to return `{ fields, relations, softDeleted }` for that request.

## Known limitations

- The cursor in `nextCursor` is unsigned base64 JSON. A forged cursor can bypass list filter validation and path params, and an unknown column in it causes a 500. Avoid cursor pagination on resources with private columns or params-based scoping.
- `limitOfTake` must be set per route; `limit=0` returns an empty page with `pages: null`.
- On PostgreSQL, `upsert` with an id that does not exist creates the row with the next sequence id, not the requested one. The sample disables `upsert`.
- `@Crud` routes return validation errors as a class-validator error list, while the identity routes return `{ status, errors }`.
