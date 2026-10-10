import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../lib/crud/index.js';
import { PostEntity } from './post.entity.js';

@Injectable()
export class PostsService extends CrudService<PostEntity> {
  constructor(
    @InjectRepository(PostEntity) repository: Repository<PostEntity>,
  ) {
    super(repository);
  }
}
