import { PostEntity } from '../modules/posts/post.entity.js';
import { RoleEntity } from '../modules/identity/roles/infrastructure/persistence/relational/entities/role.entity.js';
import { SessionEntity } from '../modules/identity/session/infrastructure/persistence/relational/entities/session.entity.js';
import { StatusEntity } from '../modules/identity/statuses/infrastructure/persistence/relational/entities/status.entity.js';
import { UserEntity } from '../modules/identity/users/infrastructure/persistence/relational/entities/user.entity.js';

/** every TypeORM entity of the app; register new entities here (used by the app, seeds and the migration CLI) */
export const entities = [
  RoleEntity,
  StatusEntity,
  UserEntity,
  SessionEntity,
  PostEntity,
];
