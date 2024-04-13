import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('post/:id')
  @UseGuards(JwtAuthGuard)
  public async likeOrUnlikePost(@Req() req: Request, @Param('id') id: number) {
    return await this.likeService.likeOrUnlikePost(req, id);
  }

  @Get('length/:id')
  @UseGuards(JwtAuthGuard)
  public async likeLength(@Req() req: Request, @Param('id') id: number) {
    return await this.likeService.likeLength(req, id);
  }

  @Get('likebycurrentuser/:id')
  @UseGuards(JwtAuthGuard)
  public async likeByCurrentUser(@Req() req: Request, @Param('id') id: number) {
    return await this.likeService.likeByCurrentUser(req, id);
  }
}
