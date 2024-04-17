import {
  Column,
  createQueryBuilder,
  Entity,
  getConnection,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import { Exclude, Expose } from 'class-transformer';
import RoleEnum from '../shared/enums/RoleEnum';
import LevelEnum from '../shared/enums/LevelEnum';
import Department from '../department/department.entity';
import Post from '../post/post.entity';
import { MyFile } from '../file/file.entity';
import Like from '../like/like.entity';
import Comment from '../comment/comment.entity';
import Notice from '../notice/notice.entity';
import { Contest } from '../contest/contest.entity';
import { Group } from '../group/group.entity';

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

  // 已经参加的社团
  @ManyToMany(() => Department, (department) => department.users)
  public departments: Department[];

  // 申请的社团
  @ManyToMany(() => Department, (department) => department.applyUsers)
  public applyDepartments: Department[];

  // 我的帖子
  @OneToMany(() => Post, (post) => post.user)
  public posts: Post[];

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

  @OneToMany(() => MyFile, (myFile) => myFile.user)
  public files: MyFile[];

  @OneToMany(() => Like, (like) => like.postOwner)
  public likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  public comments: Comment[];

  @OneToMany(() => Notice, (notice) => notice.publisher)
  public notices: Notice[];

  @OneToMany(() => Contest, (contest) => contest.publisher)
  public contests: Contest[];

  @OneToMany(() => Group, (group) => group.creator)
  public ownGroups: Group[];

  @ManyToMany(() => Group, (group) => group.users)
  public joinGroups: Group[];
}
