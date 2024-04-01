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
import { DepartmentService } from './department.service';
import { Request } from 'express';
import CreateDepartmentDTO from './dto/create-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  public async createDepartment(
    @Req() req: Request,
    @Body() departmentData: CreateDepartmentDTO,
  ) {
    return await this.departmentService.createDepartment(req, departmentData);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteDepartmentById(
    @Req() req: Request,
    @Param('id') id: number | string,
  ) {
    return await this.departmentService.deleteDepartmentById(req, Number(id));
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  public async updateDepartmentById(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() data: CreateDepartmentDTO,
  ) {
    return await this.departmentService.updateDepartmentById(req, id, data);
  }

  @Get('find/all')
  @UseGuards(JwtAuthGuard)
  public async selectAll(@Req() req: Request) {
    return await this.departmentService.selectAll(req);
  }

  @Get('find/userid=:id')
  @UseGuards(JwtAuthGuard)
  public async selectByUserId(@Req() req: Request, @Param('id') id: number) {
    return await this.departmentService.selectByUserId(req, id);
  }

  @Get('find/:id')
  @UseGuards(JwtAuthGuard)
  public async selectById(@Req() req: Request, @Param('id') id: number) {
    return await this.departmentService.selectById(req, id);
  }

  @Delete('delete/batch')
  @UseGuards(JwtAuthGuard)
  public async deleteBatch(@Req() req: Request, ids: number[]) {
    for (let id of ids) {
      this.departmentService.deleteDepartmentById(req, id);
    }
  }
}
