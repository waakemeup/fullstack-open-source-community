import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyFile } from './file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MyFile]),
    // MulterModule.register({
    //   dest: './public/files',
    // }),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
