import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { Request } from 'express';
import CreateGroupDTO from './dto/create-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  public async createGroup(
    @Req() req: Request,
    @Body() data: CreateGroupDTO,
    @Param('id') id: number,
  ) {
    return await this.groupService.createGroup(req, data, id);
  }

  @Get('query/:id')
  @UseGuards(JwtAuthGuard)
  public async queryGroupsByContest(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return await this.groupService.queryGroupsByContest(req, id);
  }

  @Post('apply/:id')
  @UseGuards(JwtAuthGuard)
  public async applyGroup(@Req() req: Request, @Param('id') id: number) {
    return await this.groupService.applyGroup(req, id);
  }

  @Post('unapply/:id')
  @UseGuards(JwtAuthGuard)
  public async unapplyGroup(@Req() req: Request, @Param('id') id: number) {
    return await this.groupService.unapplyGroup(req, id);
  }
}
