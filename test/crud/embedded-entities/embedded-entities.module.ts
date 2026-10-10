import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeController } from './employee.controller.js';
import { EmployeeEntity } from './employee.entity.js';
import { EmployeeService } from './employee.service.js';
import { UserController } from './user.controller.js';
import { UserEntity } from './user.entity.js';
import { UserService } from './user.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, EmployeeEntity])],
    controllers: [UserController, EmployeeController],
    providers: [UserService, EmployeeService],
})
export class EmbeddedEntitiesModule {}
