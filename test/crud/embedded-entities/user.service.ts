import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class UserService extends CrudService<UserEntity> {
    constructor(@InjectRepository(UserEntity) repository: Repository<UserEntity>) {
        super(repository);
    }
}
