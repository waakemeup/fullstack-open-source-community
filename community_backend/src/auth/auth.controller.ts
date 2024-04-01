import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDTO from './dto/register.dto';
import { Request } from 'express';
import LoginDTO from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import LevelEnum from '../shared/enums/LevelEnum';
import RoleEnum from '../shared/enums/RoleEnum';

declare global {
  namespace Express {
    interface User {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      username: string;
      name: string;
      level: LevelEnum;
      role: RoleEnum;
    }
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDTO, @Req() req: Request) {
    return await this.authService.register(registrationData, req);
  }

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() credential: LoginDTO, @Req() req: Request) {
    return this.authService.login(credential, req);
  }

  @HttpCode(200)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    await this.authService.logout(req);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async testAuth(@Req() req: Request) {
    return req.user;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  public async refreshToken(@Req() req: Request) {
    return this.authService.setNewTokens(req);
  }
}
