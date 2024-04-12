import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import File from '../shared/types/File.interface';
import { Request, Response } from 'express';
import { PassThrough, Readable } from 'stream';
import * as throttle from 'throttle';
import { FileService } from './file.service';
import checkFileType from '../shared/utils/checkFileType';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('upload&departmentid=:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: checkFileType,
    }),
  )
  public async uploadFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') department_id: number,
  ) {
    try {
      if (!file) throw new Error('No file uploaded');
      // console.log(file);
      await this.fileService.saveFile(req, file, department_id);
      return { message: 'File uploaded successfully' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async downloadFile(@Param('id') id: number, @Res() res: Response) {
    try {
      const file = await this.fileService.getFileById(id);
      if (!file) {
        throw new Error('File not found');
      }

      // res.setDefaultEncoding('utf-8');
      res.set({
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename=${encodeURIComponent(file.originalName)}`,
      });
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${encodeURIComponent(file.originalName)}`,
      );
      // 防止中文报错encodeURIComponent

      // res.send(file.data);
      // return new StreamableFile(file.data);
      const throttleRate = 20 * 1024 * 1024; // 设置流控速率为 20MB/s
      const fileStream = Readable.from([file.data]); // 创建可读流，读取文件缓冲区

      const throttledStream = throttle(throttleRate); // 创建流控实例
      const passThroughStream = new PassThrough(); // 创建一个可写流

      // 将可读流通过管道传输到流控实例，再将流控实例通过管道传输到可写流
      fileStream.pipe(throttledStream).pipe(passThroughStream);

      passThroughStream.pipe(res); // 将可写流传输到响应对象
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('department/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllFilesInDepartment(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return await this.fileService.getAllFilesInDepartment(req, id);
  }

  @Get('department/header/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllPendingFilesInDepartmentByHeader(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return await this.fileService.getAllPendingFilesInDepartmentByHeader(
      req,
      id,
    );
  }

  @Post('tosuccess/:id')
  @UseGuards(JwtAuthGuard)
  public async postFileToSuccess(@Req() req: Request, @Param('id') id: number) {
    return await this.fileService.postFileToSuccess(req, id);
  }

  @Post('tofail/:id')
  @UseGuards(JwtAuthGuard)
  public async postFileToFail(@Req() req: Request, @Param('id') id: number) {
    return await this.fileService.postFileToFail(req, id);
  }

  @Get('allbyheader/:id')
  @UseGuards(JwtAuthGuard)
  public async getAllFilesInDepartmentByHeader(
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    return await this.fileService.getAllFilesInDepartmentByHeader(req, id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteFile(@Req() req: Request, @Param('id') id: number) {
    return await this.fileService.deleteFile(req, id);
  }
}
