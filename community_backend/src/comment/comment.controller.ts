import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import CreateCommentDTO from './dtos/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('topost/:id')
  @UseGuards(JwtAuthGuard)
  public async commentOnPost(
    @Req() req: Request,
    @Body() body: CreateCommentDTO,
    @Param('id') id: number,
  ) {
    return await this.commentService.commentOnPost(req, body, id);
  }

  // id一定是MAINID
  @Post('tocomment/:id')
  @UseGuards(JwtAuthGuard)
  public async commentOnComment(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() data: CreateCommentDTO,
  ) {
    return await this.commentService.createSubComment(req, id, data);
  }

  @Get('allsub/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllSubComments(@Req() req: Request, @Param('id') id: number) {
    return await this.commentService.getAllSubComments(req, id);
  }

  // post_id
  @Get('main/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllMainComments(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return await this.commentService.getAllMainComments(req, id);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  public async getAllCommentsByUserId(@Req() req: Request) {
    return await this.commentService.getAllCommentsByUserId(req);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteComment(@Req() req: Request, @Param('id') id: number) {
    return await this.commentService.deleteComment(req, id);
  }
}
