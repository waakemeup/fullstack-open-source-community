import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeController } from './notice.controller';
import Notice from './notice.entity';
import { NoticeService } from './notice.service';
import { DepartmentModule } from '../department/department.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), DepartmentModule, UserModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
