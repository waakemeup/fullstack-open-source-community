import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import LevelEnum from '../shared/enums/LevelEnum';
import RoleEnum from '../shared/enums/RoleEnum';
import User from '../user/user.entity';
import Department from './department.entity';
import CreateDepartmentDTO from './dto/create-department.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private readonly userService: UserService,
  ) {}

  public async createDepartment(
    req: Request,
    departmentData: CreateDepartmentDTO,
  ) {
    const { user } = req;
    const { description, name, title, userId } = departmentData;

    if (user.role !== RoleEnum.ADMIN) {
      throw new HttpException('You are not admin user', HttpStatus.FORBIDDEN);
    }

    try {
      const department = await this.departmentRepository.findOne({
        where: { name },
      });
      if (department) {
        throw new HttpException(
          'Department already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const header = await this.userService.getById(userId);

      const newDepartment = this.departmentRepository.create({
        name,
        title,
        description,
        owner: header || null,
      });

      await this.departmentRepository.save(newDepartment);
      console.log(newDepartment);
      return newDepartment;
    } catch (err) {
      if (err.status === 400) {
        throw new HttpException(
          'department already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteDepartmentById(req: Request, id: number | string) {
    const department = await this.departmentRepository.findOne({
      id: Number(id),
    });
    if (!department)
      throw new HttpException(
        'Department does not exist',
        HttpStatus.BAD_REQUEST,
      );
    if (req.user.role !== RoleEnum.ADMIN || req.user.level !== LevelEnum.HEADER)
      throw new HttpException(
        'You are not admin user or Header',
        HttpStatus.FORBIDDEN,
      );
    try {
      const res = await this.departmentRepository.delete({
        id: Number(id),
      });
      console.log('deleteRes:' + res);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error?.message || 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async updateDepartmentById(
    req: Request,
    id: number,
    data: Partial<CreateDepartmentDTO>,
  ) {
    try {
      const { user } = req;
      if (!(user.role === RoleEnum.ADMIN)) {
        throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
      }
      const oldDepartment = await this.departmentRepository.findOne({ id });
      if (!oldDepartment)
        throw new HttpException(
          'Department with this id does not exist',
          HttpStatus.BAD_REQUEST,
        );
      // await this.departmentRepository
      //   .createQueryBuilder()
      //   .update(Department, {
      //     ...data,
      //   })
      //   .where('id = :id', { id })
      //   .returning('*')
      //   .updateEntity(true)
      //   .execute();
      const { userId, description, name, title } = data;
      const header = await this.userService.getById(userId);
      await this.departmentRepository.update(id, {
        name,
        title,
        description,
        owner: header,
      });

      return this.departmentRepository.findOneOrFail({ id });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async selectAll(req: Request) {
    try {
      const { user } = req;
      if (!(user.role === RoleEnum.ADMIN))
        throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
      return await this.departmentRepository.find({
        // relations: ['owner'],
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async selectByUserId(req: Request, id: number) {
    try {
      const { user } = req;
      if (!(user.role === RoleEnum.ADMIN))
        throw new HttpException('You are not admin user', HttpStatus.FORBIDDEN);
      const res = await this.departmentRepository.findOne({
        // relations: ['owner'],
        where: {
          owner: {
            id: id,
          },
        },
      });
      console.log('res:' + res);
      return res;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async selectById(req: Request, id: number) {
    try {
      const { user } = req;
      if (!(user.role === RoleEnum.ADMIN))
        throw new HttpException('You are not admin user', HttpStatus.FORBIDDEN);
      const department = await this.departmentRepository.findOneOrFail(id);
      return department;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async uploadDepartmentImage(
    req: Request,
    name: string,
    file: Express.Multer.File,
  ) {
    // @ts-ignore
    const department: Department = req.department;
    const { user } = req;
    const type = req.body.type;

    try {
      if (
        type !== 'image/png' &&
        type !== 'image/jpeg' &&
        type !== 'image/gif' &&
        type !== 'image/webp'
      ) {
        console.log('1:' + req.body.type);
        fs.unlinkSync(req.file.path);
        return req.res.status(400).json({ error: 'Invalid type' });
      }
      let oldImageUrn: string = '';
      if (
        type === 'image/png' ||
        type === 'image/jpeg' ||
        type === 'image/gif' ||
        type === 'image/webp'
      ) {
        oldImageUrn = department.img ?? '';
        department.img = req.file.filename;
      }
      await this.departmentRepository.save(department);

      if (oldImageUrn !== '') {
        fs.unlinkSync(`./public/images/${oldImageUrn}`);
      }

      return department;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
