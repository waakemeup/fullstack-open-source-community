import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import AbstractEntity from '../shared/utils/Entity';
import User from '../user/user.entity';
import Post from '../post/post.entity';
import LikeValueEnum from '../shared/enums/LikeValueEnum';

@Entity()
export default class Like extends AbstractEntity {
  @Column({
    default: LikeValueEnum.NOLIKE,
  })
  public value: LikeValueEnum;

  // 点赞的用户id
  @Column()
  public likeUserId: number;

  // 被赞的用户
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public postOwner: User;

  @ManyToOne(() => Post)
  public post: Post;

  // TODO:对评论点赞
  // @ManyToOne(() => Comment)
  // public comment: Comment;
}
