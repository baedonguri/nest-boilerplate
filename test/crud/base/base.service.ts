import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseEntity } from './base.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class BaseService extends CrudService<BaseEntity> {
    constructor(@InjectRepository(BaseEntity) repository: Repository<BaseEntity>) {
        super(repository);
    }
}
