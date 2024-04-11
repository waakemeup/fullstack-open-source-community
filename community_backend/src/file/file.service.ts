import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyFile } from './file.entity';
import { Repository } from 'typeorm';
// import File from '../shared/types/File.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(MyFile)
    private FileRepository: Repository<MyFile>,
  ) {}

  public async saveFile(file: Express.Multer.File) {
    try {
      const savedFile = await this.FileRepository.save({
        // filename: file.filename,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        data: file.buffer,
        encoding: file.encoding,
      });
      // console.log('save:' + savedFile);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getFileById(id: number) {
    try {
      return await this.FileRepository.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
