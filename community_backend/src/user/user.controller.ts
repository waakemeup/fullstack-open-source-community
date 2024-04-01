import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDTO from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  public async selectAll() {
    return this.userService.selectAll();
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
