import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import User from '../user/user.entity';
import Department from '../department/department.entity';

@Entity()
export default class Notice extends AbstractEntity {
  @Column({ nullable: false, type: 'text' })
  public body: string;

  @Column()
  public title: string;

  @ManyToOne(() => User, (user) => user.notices)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public publisher: User;

  @ManyToOne(() => Department, (department) => department.notices)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  public department: Department;
}
