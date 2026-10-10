import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DepthOneEntity } from './depth-one.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class DepthOneService extends CrudService<DepthOneEntity> {
    constructor(@InjectRepository(DepthOneEntity) repository: Repository<DepthOneEntity>) {
        super(repository);
    }
}
