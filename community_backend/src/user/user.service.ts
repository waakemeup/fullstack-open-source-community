import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/create-user.dto';
import LevelEnum from '../shared/enums/LevelEnum';
import { Request } from 'express';
import RoleEnum from '../shared/enums/RoleEnum';
import * as argon2 from 'argon2';

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
    const user = await this.userRepository.findOne({
      relations: ['ownDepartment', 'ownGroups', 'applyGroups', 'joinGroups'],
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        "User with this email doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({
      relations: ['ownDepartment'],
      where: { id },
    });
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

  async selectAll(req: Request) {
    try {
      const { user } = req;
      if (user.role !== RoleEnum.ADMIN)
        throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
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

  async selectAllExceptAdmin(req: Request) {
    try {
      const { user } = req;
      if (user.role !== RoleEnum.ADMIN)
        throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
      const users = await this.userRepository.find({
        relations: ['ownDepartment'],
        where: {
          role: RoleEnum.USER,
        },
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

  // TODO:修改密码 id:user_id
  public async updatePassword(
    req: Request,
    oldPassword: string,
    newPassword: string,
    newPassword2: string,
  ) {
    try {
      const user = await this.userRepository.findOne(req.user.id);
      if (newPassword !== newPassword2)
        throw new HttpException(
          '两次输入的新密码不一致',
          HttpStatus.BAD_REQUEST,
        );
      if (oldPassword === newPassword)
        throw new HttpException('新旧密码一致', HttpStatus.BAD_REQUEST);
      if (await argon2.verify(user.password, oldPassword)) {
        const hashedPassword = await argon2.hash(newPassword);
        await this.userRepository.update(req.user.id, {
          password: hashedPassword,
        });
      } else {
        throw new HttpException('旧密码不正确', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

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
        // .select(['user.id'])
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

  public async getApplyingDepartments(req: Request) {
    try {
      const { user } = req;
      const nowUser = await this.userRepository.findOne({
        relations: ['departments', 'applyDepartments'],
        where: {
          id: user.id,
        },
      });

      return nowUser.applyDepartments;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getJoinedDepartments(req: Request) {
    try {
      const { user } = req;
      const nowUser = await this.userRepository.findOne({
        relations: ['departments', 'applyDepartments'],
        where: {
          id: user.id,
        },
      });

      return nowUser.departments;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUserByAdmin(
    req: Request,
    id: number,
    data: Partial<CreateUserDTO>,
  ) {
    try {
      const { user } = req;
      if (user.role !== RoleEnum.ADMIN)
        throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
      const { role, level } = data;
      await this.userRepository.update(id, {
        role,
        level,
      });
      // console.log(await this.userRepository.findOneOrFail(id));
      return await this.userRepository.findOneOrFail(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
