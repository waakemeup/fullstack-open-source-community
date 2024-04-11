import { Column, Entity } from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';

@Entity()
export class MyFile extends AbstractEntity {
  @Column()
  originalName: string;

  @Column({
    type: 'bytea',
    nullable: true,
  })
  data: Buffer;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  encoding: string;

  // TODO:和其他实体的关系

  // 用于定位的名称
  // @Column()
  // filename: string;

  // fieldname: 'file',
  // originalname: 'retrieve.pdf',
  // mimetype: 'application/pdf',
  // filename: '24059eceb5fd817f367b4900fcbbb7e1',
  // path: 'public/files/24059eceb5fd817f367b4900fcbbb7e1',
}
