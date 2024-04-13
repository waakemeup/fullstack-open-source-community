import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Like from './like.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import Post from '../post/post.entity';
import LikeValueEnum from '../shared/enums/LikeValueEnum';
import Comment from '../comment/comment.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  public async likeOrUnlikePost(req: Request, post_id: number) {
    try {
      const { user } = req;
      const like = await this.likeRepository.findOne({
        relations: ['post'],
        where: {
          post: {
            id: post_id,
          },
          likeUserId: user.id,
        },
      });
      if (!like) {
        const post = await this.postRepository.findOne(post_id);
        const newLike = this.likeRepository.create({
          post,
          postOwner: post.user,
          value: LikeValueEnum.LIKE,
          likeUserId: user.id,
        });
        await this.likeRepository.save(newLike);
        // console.log(newLike);

        const like1 = await this.likeRepository.findOne({
          relations: ['post'],
          where: {
            post: {
              id: post_id,
            },
            likeUserId: user.id,
          },
        });
        return like1;
      } else {
        if (like.value === LikeValueEnum.LIKE) {
          await this.likeRepository.update(like.id, {
            value: LikeValueEnum.NOLIKE,
          });
        } else {
          await this.likeRepository.update(like.id, {
            value: LikeValueEnum.LIKE,
          });
        }
      }

      const like2 = await this.likeRepository.findOne({
        relations: ['post'],
        where: {
          post: {
            id: post_id,
          },
          likeUserId: user.id,
        },
      });
      return like2;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async likeLength(req: Request, post_id: number) {
    try {
      const { user } = req;
      const like = await this.likeRepository.find({
        relations: ['post'],
        where: {
          post: {
            id: post_id,
          },
          value: LikeValueEnum.LIKE,
        },
      });
      return like.length;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async likeByCurrentUser(req: Request, post_id: number) {
    try {
      const { user } = req;
      const like = await this.likeRepository.findOne({
        relations: ['post'],
        where: {
          post: {
            id: post_id,
          },
          value: LikeValueEnum.LIKE,
          likeUserId: user.id,
        },
      });
      // console.log(like);
      if (!like) return false;
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async likeOrUnlikeComment(req: Request, comment_id: number) {
    try {
      const { user } = req;
      const like = await this.likeRepository.findOne({
        relations: ['comment'],
        where: {
          comment: {
            id: comment_id,
          },
          likeUserId: user.id,
        },
      });
      if (!like) {
        const comment = await this.commentRepository.findOne({
          relations: ['user', 'post'],
          where: {
            id: comment_id,
          },
        });
        // console.log(comment);
        const newLike = this.likeRepository.create({
          comment,
          value: LikeValueEnum.LIKE,
          likeUserId: user.id,
        });
        await this.likeRepository.save(newLike);
        // console.log(newLike);

        const like1 = await this.likeRepository.findOne({
          relations: ['comment'],
          where: {
            comment: {
              id: comment_id,
            },
            likeUserId: user.id,
          },
        });
        return like1;
      } else {
        if (like.value === LikeValueEnum.LIKE) {
          await this.likeRepository.update(like.id, {
            value: LikeValueEnum.NOLIKE,
          });
        } else {
          await this.likeRepository.update(like.id, {
            value: LikeValueEnum.LIKE,
          });
        }
      }
      const like2 = await this.likeRepository.findOne({
        relations: ['comment'],
        where: {
          comment: {
            id: comment_id,
          },
          likeUserId: user.id,
        },
      });
      return like2;
    } catch (error) {
      // console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async likeLengthComment(req: Request, comment_id: number) {
    try {
      const { user } = req;
      const like = await this.likeRepository.find({
        relations: ['comment'],
        where: {
          comment: {
            id: comment_id,
          },
          value: LikeValueEnum.LIKE,
        },
      });
      return like.length;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async commentLikeByCurrentUser(req: Request, comment_id: number) {
    try {
      const { user } = req;
      const like = await this.likeRepository.findOne({
        relations: ['comment'],
        where: {
          comment: {
            id: comment_id,
          },
          value: LikeValueEnum.LIKE,
          likeUserId: user.id,
        },
      });
      // console.log(like);
      if (!like) return false;
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
