import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest } from './contest.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import CreateContestDTO from './dto/create-contest.dto';
import RoleEnum from '../shared/enums/RoleEnum';
import LevelEnum from '../shared/enums/LevelEnum';
import { UserService } from '../user/user.service';
import { DepartmentService } from '../department/department.service';

@Injectable()
export class ContestService {
  constructor(
    @InjectRepository(Contest)
    private contestRepository: Repository<Contest>,
    private userService: UserService,
    private departmentService: DepartmentService,
  ) {}

  public async createContest(req: Request, data: CreateContestDTO) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const { description, endDate, title, max, min, department } = data;
      if (max < min)
        throw new HttpException(
          'Max should be bigger than min',
          HttpStatus.BAD_REQUEST,
        );
      const userRecord = await this.userService.getById(user.id);
      const departmentRecord =
        await this.departmentService.findOneOrFail(department);
      const newContest = this.contestRepository.create({
        description,
        endDate,
        title,
        min,
        max,
        publisher: userRecord,
        department: departmentRecord,
      });
      await this.contestRepository.save(newContest);
      return newContest;
    } catch (error) {
      // console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllContestsByStu(req: Request) {
    try {
      const { user } = req;
      const contests = await this.contestRepository.find({
        relations: ['department', 'publisher'],
        order: {
          createdAt: 'ASC',
        },
      });
      return contests;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // id:department_id
  public async getAllContest(req: Request, id: number) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const contests = await this.contestRepository.find({
        relations: ['department', 'publisher'],
        where: {
          department: {
            id,
          },
        },
        order: {
          createdAt: 'ASC',
        },
      });
      // console.log(contests);
      return contests;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteContest(req: Request, id: number) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      await this.contestRepository.delete(id);
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getContestById(req: Request, id: number) {
    try {
      const { user } = req;
      // if (user.level !== LevelEnum.HEADER)
      // throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const contest = await this.contestRepository.findOne({
        relations: ['department', 'publisher'],
        where: {
          id,
        },
      });
      return contest;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateContestById(
    req: Request,
    id: number,
    data: CreateContestDTO,
  ) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const { description, endDate, max, min, title } = data;
      return await this.contestRepository.update(id, {
        description,
        endDate,
        max,
        min,
        title,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // stu have right
  public async getContestByDepartmentId(req: Request, id: number) {
    try {
      const { user } = req;
      const contestsInDepartment = await this.contestRepository.find({
        relations: ['department', 'publisher'],
        where: {
          department: {
            id,
          },
        },
        order: {
          updatedAt: 'DESC',
        },
      });
      return contestsInDepartment;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
