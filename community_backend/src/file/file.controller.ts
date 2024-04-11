import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import File from '../shared/types/File.interface';
import { Response } from 'express';
import { PassThrough, Readable } from 'stream';
import * as throttle from 'throttle';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) throw new Error('No file uploaded');
      console.log(file);
      await this.fileService.saveFile(file);
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

      res.set({
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename=${file.originalName}`,
      });

      // res.send(file.data);
      const throttleRate = 20 * 1024 * 1024; // 设置流控速率为 20MB/s
      const fileStream = Readable.from([file.data]); // 创建可读流，读取文件缓冲区

      const throttledStream = throttle(throttleRate); // 创建流控实例
      const passThroughStream = new PassThrough(); // 创建一个可写流

      // 将可读流通过管道传输到流控实例，再将流控实例通过管道传输到可写流
      fileStream.pipe(throttledStream).pipe(passThroughStream);

      passThroughStream.pipe(res); // 将可写流传输到响应对象
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
