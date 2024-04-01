import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Department from './department.entity';
import { Repository } from 'typeorm';
import CreateDepartmentDTO from './dto/create-department.dto';
import { Request } from 'express';
import RoleEnum from '../shared/enums/RoleEnum';
import LevelEnum from '../shared/enums/LevelEnum';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  public async createDepartment(
    req: Request,
    departmentData: CreateDepartmentDTO,
  ) {
    const { user } = req;
    const { description, name, title } = departmentData;

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

      const newDepartment = this.departmentRepository.create({
        name,
        title,
        description,
        owner: user,
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
      await this.departmentRepository.update(id, {
        ...data,
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
}
