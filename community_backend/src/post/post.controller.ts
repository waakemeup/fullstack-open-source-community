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
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import CreatePostDTO from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  public async createPost(
    @Req() req: Request,
    @Body() postData: CreatePostDTO,
  ) {
    return await this.postService.createPost(req, postData);
  }

  @Get('all/user')
  @UseGuards(JwtAuthGuard)
  public async getAllPostsByUserId(@Req() req: Request) {
    return await this.postService.getAllPostsByUserId(req);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async findById(@Param('id') id: number) {
    return await this.postService.getPostById(id);
  }

  // 这里的id是department_id
  @Get('all/discuss/:id?pagenumber=:pagenumber')
  @UseGuards(JwtAuthGuard)
  public async getAllDiscussPostsInDepartmentTakePage(
    @Req() req: Request,
    @Param('id') id: number,
    @Param('pagenumber') page_number: number,
  ) {
    // console.log(id, page_number);
    return await this.postService.getAllDiscussPostsInDepartmentTakePage(
      req,
      id,
      page_number,
    );
  }

  @Get('all/help/:id?pagenumber=:pagenumber')
  @UseGuards(JwtAuthGuard)
  public async getAllHelpPostsInDepartmentTakePage(
    @Req() req: Request,
    @Param('id') id: number,
    @Param('pagenumber') page_number: number,
  ) {
    // console.log(id, page_number);
    return await this.postService.getAllHelpPostsInDepartmentTakePage(
      req,
      id,
      page_number,
    );
  }

  @Get('all/admin/posts?pagenumber=:pagenumber')
  @UseGuards(JwtAuthGuard)
  public async getAllPosts(
    @Req() req: Request,
    @Param('pagenumber') page_number: number,
  ) {
    return await this.postService.getAllPosts(req, page_number);
  }

  @Get('all/stu/posts?pagenumber=:pagenumber')
  @UseGuards(JwtAuthGuard)
  public async getAllPostsStu(
    @Req() req: Request,
    @Param('pagenumber') page_number: number,
  ) {
    return await this.postService.getAllPostsStu(req, page_number);
  }

  @Get('all/header/posts?pagenumber=:pagenumber')
  @UseGuards(JwtAuthGuard)
  public async getHeaderAllPosts(
    @Req() req: Request,
    @Param('pagenumber') page_number: number,
  ) {
    return await this.postService.getHeaderAllPosts(req, page_number);
  }

  @Get('all/admin/posts&length')
  @UseGuards(JwtAuthGuard)
  public async getAllPostsLength(@Req() req: Request) {
    return await this.postService.getAllPostsLength(req);
  }

  @Get('all/stu/posts&length')
  @UseGuards(JwtAuthGuard)
  public async getAllPostsLengthStu(@Req() req: Request) {
    return await this.postService.getAllPostsLengthStu(req);
  }

  @Get('all/header/posts&length')
  @UseGuards(JwtAuthGuard)
  public async getHeaderAllPostsLength(@Req() req: Request) {
    return await this.postService.getHeaderAllPostsLength(req);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  public async deletePost(@Req() req: Request, @Param('id') id: number) {
    return await this.postService.deletePost(req, id);
  }
}
