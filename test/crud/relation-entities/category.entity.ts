import { IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { GROUP } from '../../../src/lib/crud/index.js';
import { CrudAbstractEntity } from '../crud.abstract.entity.js';

@Entity('category')
export class CategoryEntity extends CrudAbstractEntity {
    @Column('varchar', { nullable: true })
    @IsString({ groups: [GROUP.CREATE, GROUP.UPDATE, GROUP.READ_MANY, GROUP.UPSERT, GROUP.PARAMS] })
    @IsOptional({ groups: [GROUP.CREATE, GROUP.UPDATE, GROUP.READ_MANY, GROUP.UPSERT] })
    name: string;
}
