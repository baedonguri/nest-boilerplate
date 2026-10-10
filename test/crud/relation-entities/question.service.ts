import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionEntity } from './question.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class QuestionService extends CrudService<QuestionEntity> {
    constructor(@InjectRepository(QuestionEntity) repository: Repository<QuestionEntity>) {
        super(repository);
    }
}
