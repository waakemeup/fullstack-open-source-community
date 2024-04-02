import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Department from './department.entity';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from '../user/user.module';
import User from '../user/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, User]),
    MulterModule.register({ dest: './public/images' }),
    UserModule,
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService],
})
export class DepartmentModule {}
