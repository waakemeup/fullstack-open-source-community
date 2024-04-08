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
import { UserService } from './user.service';
import CreateUserDTO from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  public async selectAll() {
    return this.userService.selectAll();
  }

  @Get('aviheaders')
  @UseGuards(JwtAuthGuard)
  public async selectAllAviHeaderUser(@Req() req: Request) {
    return await this.userService.selectAllAviHeaderUser(req);
  }

  @Get('applyingdepartments')
  @UseGuards(JwtAuthGuard)
  public async getApplyingDepartments(@Req() req: Request) {
    return await this.userService.getApplyingDepartments(req);
  }

  @Get('joineddepartments')
  @UseGuards(JwtAuthGuard)
  public async getJoinedDepartments(@Req() req: Request) {
    return await this.userService.getJoinedDepartments(req);
  }

  @Get(':id')
  public async getById(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Post('create')
  public async create(@Body() user: CreateUserDTO) {
    console.log('user:', user);
    return await this.userService.create(user);
  }

  @Delete(':id')
  public async deleteUserById(@Param('id') id: number) {
    return await this.userService.deleteUserById(id);
  }
}
