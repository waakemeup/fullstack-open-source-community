import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import User from '../user/user.entity';
import { Expose } from 'class-transformer';

@Entity()
export default class Department extends AbstractEntity {
  // @Column()
  // @Index()
  // public identifier: string;

  @Column({ nullable: true })
  public img: string;

  // 社团名称
  @Column()
  public name: string;

  // 社团介绍
  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column()
  public title: string;

  // 社长
  @OneToOne(() => User, (user) => user.ownDepartment, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public owner: User;

  // TODO:管理员

  // 社员
  @ManyToMany(() => User, (user) => user.departments)
  public users: User[];

  @Expose({
    name: 'userId',
  })
  get userId(): string | number {
    return this.owner?.id || '';
  }
}
