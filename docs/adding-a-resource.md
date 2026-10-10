# Adding a resource

This walks through a `@Crud` resource. `src/modules/posts` is the complete working example — copy it and rename. For resources with real business rules, use the layered style instead (see [Architecture](architecture.md#two-ways-to-build-a-resource)).

## 1. Entity

The entity is both the table and the request contract. Validation `groups` decide which fields each generated route accepts; a field missing from a route's group is rejected with 422.

```ts
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { GROUP } from '../../lib/crud/index.js';

@Entity({ name: 'note' })
export class NoteEntity {
  @PrimaryGeneratedColumn()
  @IsInt({ groups: [GROUP.PARAMS] }) // the :id path param
  @Type(() => Number)
  id: number;

  @Column({ type: 'varchar', length: 200 })
  @IsString({ groups: [GROUP.CREATE, GROUP.UPDATE, GROUP.READ_MANY] })
  @IsOptional({ groups: [GROUP.UPDATE, GROUP.READ_MANY] }) // optional on update, filterable on list
  @MaxLength(200, { groups: [GROUP.CREATE, GROUP.UPDATE] })
  title: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date | null; // enables soft delete + recover
}
```

- Give every column an explicit `type`.
- To point at another module's table, store the id and declare the foreign key by table name — see [Architecture](architecture.md#module-boundaries).

## 2. Service

```ts
@Injectable()
export class NotesService extends CrudService<NoteEntity> {
  constructor(@InjectRepository(NoteEntity) repository: Repository<NoteEntity>) {
    super(repository);
  }
}
```

## 3. Controller

```ts
const authenticated = [ApiBearerAuth(), UseGuards(AuthGuard('jwt'))];

@Crud({
  entity: NoteEntity,
  only: [Method.READ_ONE, Method.READ_MANY, Method.CREATE, Method.UPDATE, Method.DELETE, Method.RECOVER],
  routes: {
    readOne: { relations: false },
    readMany: { paginationType: 'offset', numberOfTake: 20, limitOfTake: 100, relations: false },
    create: { decorators: authenticated },
    update: { decorators: authenticated },
    delete: { decorators: authenticated },
    recover: { decorators: authenticated },
  },
})
@ApiTags('Notes')
@Controller({ path: 'notes', version: '1' })
export class NotesController implements CrudController<NoteEntity> {
  constructor(public readonly crudService: NotesService) {}
}
```

- `only` lists the routes to generate; leave out what you do not need.
- To record who created a row, add an owner column (e.g. `authorId`) and set `create: { author: { property: 'authorId', filter: 'user.id' } }` — the value comes from the JWT, never from the client (see `modules/posts`).
- For "only the owner may change it", add an interceptor to the write routes — see `PostOwnerInterceptor` in `modules/posts`.
- All options: [CRUD reference](crud.md#options).

## 4. Module

```ts
@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
```

Put it in `src/modules/notes/` and add `NotesModule` to `AppModule` imports. Create `src/modules/notes/index.ts` only if other modules need to use something from it.

## 5. Register the entity

Add `NoteEntity` to `src/database/entities.ts`. The app, the seeds and the migration CLI all read this list.

## 6. Migration

```bash
pnpm build
pnpm migration:generate src/database/migrations/CreateNote
```

Add the generated class to `src/database/migrations/index.ts`, then `pnpm build && pnpm migration:run`. More in [Database](database.md#migrations).

## 7. Tests

Add an e2e spec under `test/<name>/` that covers what you configured: public vs authenticated routes, ownership, pagination cap. `test/posts/posts.e2e-spec.ts` is the template. See [Testing](testing.md).

## Checklist

- [ ] validation groups set for every field a route should accept
- [ ] `relations` explicit on read routes
- [ ] `paginationType: 'offset'` and `limitOfTake` on list routes
- [ ] guards on write routes, ownership interceptor if needed
- [ ] entity in `database/entities.ts`, migration generated and listed
- [ ] `pnpm lint:arch` passes (no imports into other modules' internals)
