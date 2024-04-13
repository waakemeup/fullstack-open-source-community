import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import User from '../user/user.entity';
import Post from '../post/post.entity';
import Like from '../like/like.entity';
import { makeId } from '../shared/utils';
import AbstractEntity from '../shared/utils/Entity';
import CommentTypeEnum from '../shared/enums/CommentTypeEnum';

@Entity()
export default class Comment extends AbstractEntity {
  @Index()
  @Column()
  public identifier: string;

  @Column()
  public body: string;

  @Column({
    default: CommentTypeEnum.MAIN,
  })
  public type: CommentTypeEnum;

  // 被留言者id
  @Column()
  public commentUserId: number;

  // 留言者
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  public post: Post;

  // 副留言对主留言多对一
  @ManyToOne(() => Comment, { nullable: true })
  mainComment: Comment;

  @OneToMany(() => Like, (like) => like.comment, { eager: true })
  public likes: Like[];

  // @Expose()
  // get voteScore(): number {
  //   return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  // }

  // protected userVote: number;
  // setUserVote(user: User) {
  //   const index = this.votes?.findIndex((v) => v.userId === user.id);
  //   this.userVote = index > -1 ? this.votes[index].value : 0;
  // }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
