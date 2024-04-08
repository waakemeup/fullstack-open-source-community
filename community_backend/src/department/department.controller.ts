import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Request } from 'express';
import CreateDepartmentDTO from './dto/create-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnDepartmentGuard } from './guards/own-department.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../shared/multer/editFileName';
import { imageFileFilter } from '../shared/multer/imageFileFilter';

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

  @Get('find/allbystu')
  public async stuSelectAll() {
    return await this.departmentService.stuSelectAll();
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

  @Get('stu/find/:id')
  public async stuSelectById(@Param('id') id: number) {
    return await this.departmentService.stuSelectById(id);
  }

  @Delete('delete/batch')
  @UseGuards(JwtAuthGuard)
  public async deleteBatch(@Req() req: Request, ids: number[]) {
    for (let id of ids) {
      this.departmentService.deleteDepartmentById(req, id);
    }
  }

  @Post(':name/upload')
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnDepartmentGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  public async uploadImage(
    @Req() req: Request,
    @Param('name') name: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.departmentService.uploadDepartmentImage(req, name, file);
  }

  @Post('stu/apply')
  @UseGuards(JwtAuthGuard)
  public async applyDepartment(
    @Req() req: Request,
    @Body() data: { id: number },
  ) {
    return await this.departmentService.applyOrCancelDepartment(req, data.id);
  }

  @Get('header/applyusers')
  @UseGuards(JwtAuthGuard)
  public async getApplyMyDepartmentUsers(@Req() req: Request) {
    return await this.departmentService.getApplyMyDepartmentUsers(req);
  }

  @Post('header/accept')
  @UseGuards(JwtAuthGuard)
  public async accecptApply(@Req() req: Request, @Body() id: number) {
    return await this.departmentService.accecptApply(req, id);
  }

  @Post('header/reject')
  @UseGuards(JwtAuthGuard)
  public async rejectApply(@Req() req: Request, @Body() id: number) {
    return await this.departmentService.rejectApply(req, id);
  }

  @Get('header/users')
  @UseGuards(JwtAuthGuard)
  public async getAllDepartmentUsers(@Req() req: Request) {
    return await this.departmentService.getAllDepartmentUsers(req);
  }

  @Post('header/removeuser')
  @UseGuards(JwtAuthGuard)
  public async removeUserFromDepartment(
    @Req() req: Request,
    @Body() id: number,
  ) {
    return await this.departmentService.removeFromDepartment(req, id);
  }
}
