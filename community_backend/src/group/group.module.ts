import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { UserModule } from '../user/user.module';
import { ContestModule } from '../contest/contest.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), UserModule, ContestModule],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
