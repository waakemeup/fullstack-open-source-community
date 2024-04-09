import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { RedisModule } from '@nestjs-modules/ioredis';
import { DepartmentModule } from './department/department.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_DBNAME: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: 'redis://localhost:6379',
        },
      }),
    }),
    DatabaseModule,
    AuthModule,
    DepartmentModule,
    PostModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
