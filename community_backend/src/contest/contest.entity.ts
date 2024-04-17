import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import User from '../user/user.entity';
import Department from '../department/department.entity';
import { Group } from '../group/group.entity';

// 组队参赛
@Entity()
export class Contest extends AbstractEntity {
  @Column()
  public title: string;

  @Column({ nullable: false, type: 'text' })
  public description: string;

  @ManyToOne(() => User, (user) => user.contests)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public publisher: User;

  @ManyToOne(() => Department, (department) => department.contests)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  public department: Department;

  // 队伍最少人数
  @Column()
  public min: number;

  // 最多人数
  @Column()
  public max: number;

  // 队伍
  @OneToMany(() => Group, (group) => group.contest)
  public groups: Group[];

  @Column({ nullable: false, type: 'date' })
  public endDate: Date;
}
