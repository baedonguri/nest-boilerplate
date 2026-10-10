import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { GROUP } from '../../../src/lib/crud/index.js';
import { CrudAbstractEntity } from '../crud.abstract.entity.js';

@Entity('base')
export class UniqueEntity extends CrudAbstractEntity {
    @Column('varchar', { unique: true })
    @IsString({ groups: [GROUP.CREATE, GROUP.UPDATE, GROUP.READ_MANY, GROUP.UPSERT] })
    @Type(() => String)
    name: string;
}
