import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmployeeEntity } from './employee.entity.js';
import { CrudService } from '../../../src/lib/crud/crud.service.js';

@Injectable()
export class EmployeeService extends CrudService<EmployeeEntity> {
    constructor(@InjectRepository(EmployeeEntity) repository: Repository<EmployeeEntity>) {
        super(repository);
    }
}
