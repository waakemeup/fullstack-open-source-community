import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/create-user.dto';
import LevelEnum from '../shared/enums/LevelEnum';
import { Request } from 'express';
import RoleEnum from '../shared/enums/RoleEnum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async create(userData: CreateUserDTO) {
    try {
      const newUser = this.userRepository.create(userData);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new HttpException(
        "User with this email doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      return null;
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getByUsername(username: string) {
    const user = this.userRepository.findOne(
      { username },
      {
        select: ['createdAt', 'username', 'id'],
      },
    );

    if (!user) {
      throw new HttpException(
        'User with this username does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async updateById(user: User) {
    try {
      await this.userRepository.update({ id: user.id }, user);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async selectAll() {
    try {
      const users = await this.userRepository.find({
        relations: ['ownDepartment'],
      });
      console.log(users);
      return users;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUserById(id: number) {
    try {
      const user = await this.userRepository.delete({ id });
      return user;
    } catch (error) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // TODO:修改密码
  async updatePassword(user: CreateUserDTO) {}

  async selectAllAviHeaderUser(req: Request) {
    try {
      // const aviHeaderUsers = await this.userRepository.find({
      //   where: {
      //     level: LevelEnum.HEADER,
      //     ownDepartment: null,
      //   },
      // });
      // return aviHeaderUsers;
      const { user } = req;
      if (user.role !== RoleEnum.ADMIN) {
        throw new HttpException('You can not do this', HttpStatus.FORBIDDEN);
      }
      const aviHeaderUsers = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.ownDepartment', 'ownDepartment')
        .where('user.level = :level', { level: LevelEnum.HEADER })
        .andWhere('ownDepartment.id IS NULL')
        .select(['user.id'])
        .getMany();
      return aviHeaderUsers;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'No Header User Avilable',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
