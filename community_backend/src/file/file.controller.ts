import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file) {
    try {
      if (!file) throw new Error('No file uploaded');
      console.log(file);
      return { message: 'File uploaded successfully' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
