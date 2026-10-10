import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ForeignKey,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GROUP } from '../../lib/crud/index.js';

/** sample @Crud resource: validation `groups` decide which fields each generated route accepts (see lib/crud) */
@Entity({ name: 'post' })
export class PostEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  @IsInt({ groups: [GROUP.PARAMS] })
  @Type(() => Number)
  id: number;

  @ApiProperty({ type: String, example: 'Hello' })
  @Column({ type: 'varchar', length: 200 })
  @IsString({ groups: [GROUP.CREATE, GROUP.UPDATE, GROUP.READ_MANY] })
  @IsOptional({ groups: [GROUP.UPDATE, GROUP.READ_MANY] })
  @MaxLength(200, { groups: [GROUP.CREATE, GROUP.UPDATE] })
  title: string;

  @ApiProperty({ type: String, example: 'First post' })
  @Column({ type: 'text' })
  @IsString({ groups: [GROUP.CREATE, GROUP.UPDATE] })
  @IsOptional({ groups: [GROUP.UPDATE] })
  content: string;

  /** set from the JWT on create (`author` option); filterable on read-many. Cross-context reference by id only: the FK targets the identity `user` table by name, so posts never imports identity persistence */
  @ApiProperty({ type: Number })
  @Index()
  @ForeignKey('user', 'id', { onDelete: 'CASCADE' })
  @Column({ type: 'integer' })
  @IsOptional({ groups: [GROUP.READ_MANY] })
  @IsInt({ groups: [GROUP.READ_MANY] })
  @Type(() => Number)
  authorId: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date | null;
}
