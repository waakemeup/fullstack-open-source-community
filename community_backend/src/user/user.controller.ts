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
import { UserService } from './user.service';
import CreateUserDTO from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  public async selectAll(@Req() req: Request) {
    return this.userService.selectAll(req);
  }

  @Get('allexceptadmin')
  @UseGuards(JwtAuthGuard)
  public async selectAllExceptAdmin(@Req() req: Request) {
    return this.userService.selectAllExceptAdmin(req);
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
  @UseGuards(JwtAuthGuard)
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

  @Put('updatebyadmin/:id')
  @UseGuards(JwtAuthGuard)
  public async updateUserByAdmin(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() data: Partial<CreateUserDTO>,
  ) {
    return await this.userService.updateUserByAdmin(req, id, data);
  }

  @Post('updatepassword')
  @UseGuards(JwtAuthGuard)
  public async updatePassword(
    @Req() req: Request,
    @Body()
    data: {
      id: number;
      oldPassword: string;
      newPassword: string;
      newPassword2: string;
    },
  ) {
    return await this.userService.updatePassword(
      req,
      data.oldPassword,
      data.newPassword,
      data.newPassword2,
    );
  }
}
