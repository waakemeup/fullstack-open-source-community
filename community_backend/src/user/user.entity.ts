import {
  Column,
  createQueryBuilder,
  Entity,
  getConnection,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import { Exclude, Expose } from 'class-transformer';
import RoleEnum from '../shared/enums/RoleEnum';
import LevelEnum from '../shared/enums/LevelEnum';
import Department from '../department/department.entity';

@Entity()
export default class User extends AbstractEntity {
  @Index()
  @Column({ unique: true })
  public email: string;

  // 用户名
  @Column({ unique: true })
  public username: string;

  // 姓名
  @Column()
  public name: string;

  @Exclude()
  @Column()
  public password: string;

  // 自己是社长的社团 TODO:
  @OneToOne(() => Department, (department) => department.owner)
  @Exclude({
    toClassOnly: true,
  })
  public ownDepartment: Department;

  // 参加的社团
  @ManyToMany(() => Department, (department) => department.users)
  public departments: Department[];

  // 角色
  @Column({
    default: RoleEnum.USER,
  })
  public role: RoleEnum;

  // 身份
  @Column({
    default: LevelEnum.STUDENT,
  })
  public level: LevelEnum;
}
