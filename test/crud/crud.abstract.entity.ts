import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { GROUP } from '../../src/lib/crud/interface/index.js';

export class CrudAbstractEntity extends BaseEntity {
    /** integer, not bigint: PostgreSQL returns bigint as a string and these specs expect numeric ids */
    @PrimaryGeneratedColumn({ type: 'integer' })
    @IsNumber({}, { groups: [GROUP.PARAMS] })
    @Type(() => Number)
    id: number;

    /**
     * Deleted at
     */
    @DeleteDateColumn()
    @ApiHideProperty()
    deletedAt?: Date;

    /**
     * Created at
     */
    @CreateDateColumn()
    @ApiProperty({ description: 'Created At' })
    createdAt?: Date;

    /**
     * Last modified at
     */
    @UpdateDateColumn()
    @ApiProperty({ description: 'Last Modified At' })
    lastModifiedAt?: Date;
}
