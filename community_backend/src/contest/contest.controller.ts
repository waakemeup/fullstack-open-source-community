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
import { ContestService } from './contest.service';
import { Request } from 'express';
import CreateContestDTO from './dto/create-contest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  public async createContest(
    @Req() req: Request,
    @Body() data: CreateContestDTO,
  ) {
    return await this.contestService.createContest(req, data);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getContestById(@Req() req: Request, @Param('id') id: number) {
    return await this.contestService.getContestById(req, id);
  }

  @Get('all/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllContests(@Req() req: Request, @Param('id') id: number) {
    return await this.contestService.getAllContest(req, id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteContest(@Req() req: Request, @Param('id') id: number) {
    return await this.contestService.deleteContest(req, id);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  public async updateContest(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() data: CreateContestDTO,
  ) {
    return await this.contestService.updateContestById(req, id, data);
  }
}
