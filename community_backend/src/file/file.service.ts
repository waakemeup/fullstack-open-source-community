import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyFile } from './file.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
// import File from '../shared/types/File.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(MyFile)
    private FileRepository: Repository<MyFile>,
  ) {}

  public async saveFile(
    req: Request,
    file: Express.Multer.File,
    department_id: number,
  ) {
    try {
      const { user } = req;

      const savedFile = await this.FileRepository.save({
        // filename: file.filename,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        data: file.buffer,
        encoding: file.encoding,
        user: {
          id: user.id,
        },
        department: {
          id: department_id,
        },
      });
      console.log(file);
      console.log(savedFile);
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

  public async getAllFilesInDepartment(req: Request, department_id: number) {
    try {
      // const { user } = req;
      const files = await this.FileRepository.find({
        // relations: ['user', 'department'],
        where: {
          department: {
            id: department_id,
          },
        },
      });
      return files;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
