import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comment from './comment.entity';
import Post from '../post/post.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post]), UserModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
