import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Request } from 'express';
import CreateNoticeDTO from './dto/create-notice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  public async createNotice(
    @Req() req: Request,
    @Body() data: CreateNoticeDTO,
  ) {
    return await this.noticeService.createNotice(req, data);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  public async getAllNotices(@Req() req: Request) {
    return await this.noticeService.getAllNotices(req);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getNoticeById(@Req() req: Request, @Param('id') id: number) {
    return await this.noticeService.getNoticeById(req, id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteNotice(@Req() req: Request, @Param('id') id: number) {
    return await this.noticeService.deleteNotice(req, id);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  public async updateNoticeById(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() data: CreateNoticeDTO,
  ) {
    return await this.noticeService.updateNoticeById(req, id, data);
  }

  @Get('header/all/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllNoticesInDepartmentById(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return await this.noticeService.getAllNoticesInDepartmentById(req, id);
  }
}
