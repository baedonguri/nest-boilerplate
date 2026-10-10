import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Method } from '../../lib/crud/index.js';
import { PostOwnerInterceptor } from './post-owner.interceptor.js';
import { PostEntity } from './post.entity.js';
import { PostsService } from './posts.service.js';

const authenticated = [ApiBearerAuth(), UseGuards(AuthGuard('jwt'))];

/** reference @Crud resource: public reads, authenticated writes, author-only changes, offset pagination capped at 100 */
@Crud({
  entity: PostEntity,
  only: [
    Method.READ_ONE,
    Method.READ_MANY,
    Method.SEARCH,
    Method.CREATE,
    Method.UPDATE,
    Method.DELETE,
    Method.RECOVER,
  ],
  routes: {
    /** @Crud joins every relation by default (despite its JSDoc); keep reads explicit so a relation added later is not exposed by accident */
    readOne: { relations: false },
    readMany: {
      paginationType: 'offset',
      numberOfTake: 20,
      limitOfTake: 100,
      relations: false,
    },
    search: {
      paginationType: 'offset',
      numberOfTake: 20,
      limitOfTake: 100,
      relations: false,
    },
    create: {
      decorators: authenticated,
      author: { property: 'authorId', filter: 'user.id' },
    },
    update: { decorators: authenticated, interceptors: [PostOwnerInterceptor] },
    delete: { decorators: authenticated, interceptors: [PostOwnerInterceptor] },
    recover: {
      decorators: authenticated,
      interceptors: [PostOwnerInterceptor],
    },
  },
})
@ApiTags('Posts')
@Controller({ path: 'posts', version: '1' })
export class PostsController implements CrudController<PostEntity> {
  constructor(public readonly crudService: PostsService) {}
}
