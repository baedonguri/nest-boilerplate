import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Observable } from 'rxjs';
import { RoleEnum, type JwtPayloadType } from '../identity/index.js';
import { RequestWithUser } from '../../common/types/request-with-user.type.js';
import { PostEntity } from './post.entity.js';

/** only the author (or an admin) may change a post; a missing post falls through to the CRUD route's own 404 */
@Injectable()
export class PostOwnerInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context
      .switchToHttp()
      .getRequest<
        RequestWithUser<JwtPayloadType> & { params: { id?: string } }
      >();
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return next.handle();
    }
    const post = await this.repository.findOne({
      where: { id },
      withDeleted: true,
      select: { id: true, authorId: true },
    });
    const isAdmin = String(req.user.role?.id) === String(RoleEnum.admin);
    if (post && post.authorId !== req.user.id && !isAdmin) {
      throw new ForbiddenException();
    }
    return next.handle();
  }
}
