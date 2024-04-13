import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Like from './like.entity';
import Post from '../post/post.entity';
import Comment from '../comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post, Comment])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
