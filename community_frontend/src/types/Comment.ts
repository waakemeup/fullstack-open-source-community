import CommentTypeEnum from "./enums/CommentTypeEnum";
import Like from "./Like";
import Post from "./Post";
import { User } from "./User";

export default interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  identifier: string;
  body: string;
  type: CommentTypeEnum;
  commentUserId: number;
  commentUsername?: string;
  post: Post;
  user: User;
  likes: Like[];
}
