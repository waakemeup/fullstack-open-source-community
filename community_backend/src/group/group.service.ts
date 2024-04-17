import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import CreateGroupDTO from './dto/create-group.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { ContestService } from '../contest/contest.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private userService: UserService,
    private contestService: ContestService,
  ) {}

  // id:contest_id
  public async createGroup(req: Request, data: CreateGroupDTO, id: number) {
    try {
      const { user } = req;
      const userRecord = await this.userService.getById(user.id);
      const { name } = data;
      const contestRecord = await this.contestService.getContestById(req, id);
      const newGroup = this.groupRepository.create({
        contest: contestRecord,
        creator: userRecord,
        name,
      });
      newGroup.users = [];
      newGroup.applyUsers = [];
      newGroup.users.push(userRecord);
      await this.groupRepository.save(newGroup);

      return newGroup;
    } catch (error) {
      // console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // id:contest_id
  public async queryGroupsByContest(req: Request, id: number) {
    try {
      const { user } = req;
      const groups = await this.groupRepository.find({
        contest: {
          id,
        },
      });
      // console.log(groups);

      return groups;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // group_id
  public async applyGroup(req: Request, id: number) {
    try {
      const { user } = req;
      const userRecord = await this.userService.getById(user.id);
      const group = await this.groupRepository.findOne(id);
      group.applyUsers.push(userRecord);
      await this.groupRepository.save(group);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async unapplyGroup(req: Request, id: number) {
    try {
      const { user } = req;
      // const userRecord = await this.userService.getById(user.id);
      const group = await this.groupRepository.findOne(id);
      group.applyUsers = group.applyUsers.filter(
        (user1) => user1.id !== user.id,
      );
      await this.groupRepository.save(group);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
