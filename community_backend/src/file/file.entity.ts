import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import FileStatusEnum from '../shared/enums/FileStatusEnum';
import User from '../user/user.entity';
import Department from '../department/department.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class MyFile extends AbstractEntity {
  @Column()
  public originalName: string;

  @Column({
    type: 'bytea',
    nullable: true,
  })
  @Exclude()
  public data: Buffer;

  @Column()
  public mimeType: string;

  @Column()
  public size: number;

  @Column()
  public encoding: string;

  // TODO:管理员审核
  @Column({
    default: FileStatusEnum.PENDING,
  })
  public status: FileStatusEnum;

  @ManyToOne(() => User, (user) => user.files, {
    eager: true,
    // cascade: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @ManyToOne(() => Department, (department) => department.files, {
    eager: true,
    // cascade: true,
  })
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  public department: Department;

  // 用于定位的名称
  // @Column()
  // filename: string;

  // fieldname: 'file',
  // originalname: 'retrieve.pdf',
  // mimetype: 'application/pdf',
  // filename: '24059eceb5fd817f367b4900fcbbb7e1',
  // path: 'public/files/24059eceb5fd817f367b4900fcbbb7e1',
}
