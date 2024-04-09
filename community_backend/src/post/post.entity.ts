import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import User from '../user/user.entity';
import { makeId } from '../shared/utils';
import Department from '../department/department.entity';
import PostTypeEnum from '../shared/enums/PostTypeEnum';
import { Expose } from 'class-transformer';

@Entity()
export default class Post extends AbstractEntity {
  @Index()
  @Column()
  public identifier: string; //7 Character Id

  @Column()
  public title: string;

  @Column({ nullable: true, type: 'text' })
  public body: string;

  @Column()
  public departmentName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @ManyToOne(() => Department, (department) => department.posts)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  public department: Department;

  @Column({ nullable: false, default: PostTypeEnum.DISCUSS })
  public type: PostTypeEnum;

  // @Expose() get department_id() {
  //   return this.department.id;
  // }

  // @Expose() get user_id() {
  //   return this.user.id;
  // }

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(7);
  }
}
