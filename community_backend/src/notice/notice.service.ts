import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Notice from './notice.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import CreateNoticeDTO from './dto/create-notice.dto';
import LevelEnum from '../shared/enums/LevelEnum';
import RoleEnum from '../shared/enums/RoleEnum';
import { DepartmentService } from '../department/department.service';
import { UserService } from '../user/user.service';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
    private departmentService: DepartmentService,
    private userService: UserService,
  ) {}

  public async createNotice(req: Request, data: CreateNoticeDTO) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER && user.role !== RoleEnum.ADMIN)
        throw new HttpException(
          'You do not have the right',
          HttpStatus.FORBIDDEN,
        );
      const { body, department, title } = data;
      const departmentRecord =
        await this.departmentService.findOneOrFail(department);
      const userRecord = await this.userService.getById(user.id);
      const newNotice = this.noticeRepository.create({
        body,
        department: departmentRecord,
        publisher: userRecord,
        title,
      });
      await this.noticeRepository.save(newNotice);
      return newNotice;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllNotices(req: Request) {
    try {
      const { user } = req;
      const notices = await this.noticeRepository.find({
        relations: ['publisher', 'department'],
        order: {
          createdAt: 'ASC',
        },
      });
      // console.log(notices);
      return notices;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteNotice(req: Request, id: number) {
    try {
      const { user } = req;
      if (user.role !== RoleEnum.ADMIN && user.level !== LevelEnum.HEADER)
        throw new HttpException(
          'You do not have the right',
          HttpStatus.FORBIDDEN,
        );
      await this.noticeRepository.delete(id);
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getNoticeById(req: Request, id: number) {
    try {
      const { user } = req;
      const notice = await this.noticeRepository.findOne({
        relations: ['publisher', 'department'],
        where: {
          id,
        },
      });
      return notice;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateNoticeById(
    req: Request,
    id: number,
    data: CreateNoticeDTO,
  ) {
    try {
      const { user } = req;
      const { body, department, title } = data;

      if (user.role !== RoleEnum.ADMIN && user.level !== LevelEnum.HEADER)
        throw new HttpException(
          'You do not have the right',
          HttpStatus.FORBIDDEN,
        );
      const departmentRecord =
        await this.departmentService.findOneOrFail(department);
      const userRecord = await this.userService.getById(user.id);
      await this.noticeRepository.update(id, {
        body,
        department: departmentRecord,
        publisher: userRecord,
        title,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // id:department_id
  public async getAllNoticesInDepartmentById(req: Request, id: number) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      const notices = await this.noticeRepository.find({
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
      return notices;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
