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
      await this.groupRepository.save(newGroup);
      return newGroup;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
