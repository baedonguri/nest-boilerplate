import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './comment.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class CommentService extends CrudService<CommentEntity> {
    constructor(@InjectRepository(CommentEntity) repository: Repository<CommentEntity>) {
        super(repository);
    }
}
