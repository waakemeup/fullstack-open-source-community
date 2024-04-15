import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyFile } from './file.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import LevelEnum from '../shared/enums/LevelEnum';
import FileStatusEnum from '../shared/enums/FileStatusEnum';
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

  // SUCCESS
  public async getAllFilesInDepartment(req: Request, department_id: number) {
    try {
      // const { user } = req;
      const files = await this.FileRepository.find({
        // relations: ['user', 'department'],
        where: {
          department: {
            id: department_id,
          },
          status: FileStatusEnum.SUCCESS,
        },
      });
      return files;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // All Files
  public async getAllFilesInDepartmentByHeader(
    req: Request,
    department_id: number,
  ) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
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

  // 未经审核的所有file
  public async getAllPendingFilesInDepartmentByHeader(
    req: Request,
    department_id: number,
  ) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const files = await this.FileRepository.find({
        // relations: ['user', 'department'],
        where: {
          department: {
            id: department_id,
          },
          status: FileStatusEnum.PENDING,
        },
      });
      return files;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // status -> success
  public async postFileToSuccess(req: Request, id: number) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const file = await this.FileRepository.update(id, {
        status: FileStatusEnum.SUCCESS,
      });
      return file;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // status -> fail
  public async postFileToFail(req: Request, id: number) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const file = await this.FileRepository.update(id, {
        status: FileStatusEnum.FAIL,
      });
      return file;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // delete
  public async deleteFile(req: Request, id: number) {
    try {
      const { user } = req;
      const file = await this.FileRepository.findOne(id);
      if (user.level !== LevelEnum.HEADER && file.user.id !== user.id)
        throw new HttpException(
          'You are not header or file owner',
          HttpStatus.FORBIDDEN,
        );
      await this.FileRepository.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllFilesByUserId(req: Request) {
    try {
      const { user } = req;
      const files = await this.FileRepository.find({
        where: {
          user: {
            id: user.id,
          },
        },
      });
      return files;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
