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
import { GroupService } from './group.service';
import { Request } from 'express';
import CreateGroupDTO from './dto/create-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('applymygroup')
  @UseGuards(JwtAuthGuard)
  public async applyMyGroupQuery(@Req() req: Request) {
    return await this.groupService.applyMyGroupQuery(req);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getById(@Req() req: Request, @Param('id') id: number) {
    return await this.groupService.getById(req, id);
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  public async acceptApply(
    @Req() req: Request,
    @Body() data: { groupId: number; userId: number },
  ) {
    return await this.groupService.acceptApply(req, data);
  }

  @Post('reject')
  @UseGuards(JwtAuthGuard)
  public async rejectApply(
    @Req() req: Request,
    @Body() data: { groupId: number; userId: number },
  ) {
    return await this.groupService.rejectApply(req, data);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  public async removeUser(
    @Req() req: Request,
    @Body() data: { groupId: number; userId: number },
  ) {
    return await this.groupService.removeUserFromGroup(req, data);
  }

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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteGroup(@Req() req: Request, @Param('id') id: number) {
    return await this.groupService.deleteGroup(req, id);
  }
}
