import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { GROUP } from '../../../src/lib/crud/interface/index.js';
import { CrudAbstractEntity } from '../crud.abstract.entity.js';

@Entity('base')
export class BaseEntity extends CrudAbstractEntity {
    @Column({ nullable: true })
    @IsString({ groups: [GROUP.CREATE, GROUP.UPDATE, GROUP.READ_MANY, GROUP.UPSERT, GROUP.PARAMS, GROUP.SEARCH] })
    @IsOptional({ groups: [GROUP.CREATE, GROUP.UPDATE, GROUP.READ_MANY, GROUP.UPSERT, GROUP.SEARCH] })
    name: string;

    @Column({ nullable: true })
    @Type(() => Number)
    @IsInt({ always: true })
    @IsOptional({ always: true })
    type: number;

    @Column({ nullable: true })
    @IsString({ always: true })
    @IsOptional({ always: true })
    description: string;
}
