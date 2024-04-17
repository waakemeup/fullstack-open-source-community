import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
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
}
