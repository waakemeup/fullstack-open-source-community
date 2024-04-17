import { Module } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from './contest.entity';
import { UserModule } from '../user/user.module';
import { DepartmentModule } from '../department/department.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contest]), UserModule, DepartmentModule],
  providers: [ContestService],
  controllers: [ContestController],
  exports: [ContestService],
})
export class ContestModule {}
