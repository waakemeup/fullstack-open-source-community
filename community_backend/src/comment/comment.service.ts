import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from './comment.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import CreateCommentDTO from './dtos/create-comment.dto';
import Post from '../post/post.entity';
import User from '../user/user.entity';
import { UserService } from '../user/user.service';

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
        },
      });
      return mainComments;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
