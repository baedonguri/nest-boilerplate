import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DepthTwoEntity } from './depth-two.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class DepthTwoService extends CrudService<DepthTwoEntity> {
    constructor(@InjectRepository(DepthTwoEntity) repository: Repository<DepthTwoEntity>) {
        super(repository);
    }
}
