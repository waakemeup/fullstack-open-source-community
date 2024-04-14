import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from './comment.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import CreateCommentDTO from './dtos/create-comment.dto';
import Post from '../post/post.entity';
import User from '../user/user.entity';
import { UserService } from '../user/user.service';
import CommentTypeEnum from '../shared/enums/CommentTypeEnum';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  public async commentOnPost(
    req: Request,
    data: CreateCommentDTO,
    post_id: number,
  ) {
    try {
      const { user } = req;
      const post = await this.postRepository.findOne({
        relations: ['user'],
        where: {
          id: post_id,
        },
      });
      const user2 = await this.userService.getById(user.id);
      const comment = this.commentRepository.create({
        body: data.body,
        post,
        commentUserId: post.user.id, //被留言者id
        user: user2,
      });
      await this.commentRepository.save(comment);
      return comment;
    } catch (error) {
      // console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllMainComments(req: Request, post_id: number) {
    try {
      const { user } = req;
      const mainComments = await this.commentRepository.find({
        relations: ['post', 'user'],
        where: {
          post: {
            id: post_id,
          },
          type: CommentTypeEnum.MAIN,
        },
      });
      return mainComments;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async createSubComment(
    req: Request,
    main_id: number,
    data: CreateCommentDTO,
  ) {
    try {
      let target_comment: Comment;
      const { user } = req;
      const father_comment = await this.commentRepository.findOne({
        relations: ['user', 'mainComment'],
        where: {
          id: main_id,
        },
      });
      // console.log(father_comment);

      // 因为最多两层
      if (father_comment.type === CommentTypeEnum.MAIN) {
        target_comment = father_comment;
      } else if (father_comment.mainComment.type === CommentTypeEnum.MAIN) {
        target_comment = father_comment.mainComment;
      }
      target_comment = await this.commentRepository.findOne({
        relations: ['post', 'user'],
        where: {
          id: target_comment.id,
        },
      });

      // console.log(target_comment);
      const userRecord = await this.userService.getById(user.id);
      // console.log(userRecord);
      const subComment = this.commentRepository.create({
        body: data.body,
        commentUserId: data.user.id, //id是回复那个人的id
        commentUsername: data.user.username, //id是回复那个人的id
        mainComment: target_comment, //一定是最高级
        user: userRecord,
        type: CommentTypeEnum.SUB,
        post: target_comment.post,
      });
      // console.log(subComment);
      // SUB不能做父级,都要返回最高级的MAIN
      await this.commentRepository.save(subComment);
      return subComment;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllSubComments(req: Request, comment_id: number) {
    try {
      const { user } = req;
      const comments = await this.commentRepository.find({
        relations: ['user'],
        where: {
          mainComment: {
            id: comment_id,
          },
          type: CommentTypeEnum.SUB,
        },
        order: {
          createdAt: 'ASC',
        },
      });
      return comments;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
