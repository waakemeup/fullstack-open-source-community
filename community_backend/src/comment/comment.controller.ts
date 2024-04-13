import {
  Body,
  Controller,
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

  // post_id
  @Get('main/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllMainComments(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return await this.commentService.getAllMainComments(req, id);
  }
}
