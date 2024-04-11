import { Column, Entity } from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';

@Entity()
export class MyFile extends AbstractEntity {
  @Column()
  name: string;

  @Column({
    type: 'bytea',
  })
  data: Buffer;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  // fieldname: 'file',
  // originalname: 'retrieve.pdf',
  // encoding: '7bit',
  // mimetype: 'application/pdf',
  // destination: './public/files',
  // filename: '24059eceb5fd817f367b4900fcbbb7e1',
  // path: 'public/files/24059eceb5fd817f367b4900fcbbb7e1',
}
