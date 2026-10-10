import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UniqueEntity } from './unique.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class UniqueService extends CrudService<UniqueEntity> {
    constructor(@InjectRepository(UniqueEntity) repository: Repository<UniqueEntity>) {
        super(repository);
    }
}
