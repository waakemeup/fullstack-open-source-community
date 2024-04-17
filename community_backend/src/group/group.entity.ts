import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import { Contest } from '../contest/contest.entity';
import User from '../user/user.entity';

@Entity()
export class Group extends AbstractEntity {
  @Column()
  public name: string;

  @ManyToOne(() => Contest, (contest) => contest.groups, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contest_id', referencedColumnName: 'id' })
  public contest: Contest;

  // 创建者
  @ManyToOne(() => User, (user) => user.ownGroups, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'id' })
  public creator: User;

  // 队伍成员
  @ManyToMany(() => User, (user) => user.joinGroups, {
    eager: true,
  })
  public users: User[];
}
