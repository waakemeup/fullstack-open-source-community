import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './post.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from '../department/department.service';
import CreatePostDTO from './dto/create-post.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import PostTypeEnum from '../shared/enums/PostTypeEnum';
import RoleEnum from '../shared/enums/RoleEnum';
import LevelEnum from '../shared/enums/LevelEnum';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private departmentService: DepartmentService,
    private userService: UserService,
  ) {}

  public async createPost(req: Request, postData: CreatePostDTO) {
    try {
      const { user } = req;
      const { body, department, title, type } = postData;

      const departmentRecord =
        await this.departmentService.findOneOrFail(department);
      const userRecord = await this.userService.getById(user.id);

      const post = this.postRepository.create({
        title,
        body,
        department: departmentRecord,
        type,
        departmentName: department,
        user: userRecord,
      });

      await this.postRepository.save(post);
      return post;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getPostById(id: number) {
    try {
      const post = await this.postRepository.findOneOrFail({
        relations: ['user', 'department'],
        where: {
          id,
        },
      });
      return post;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllDiscussPostsInDepartmentTakePage(
    req: Request,
    department_id: number,
    page_number: number,
  ) {
    try {
      const PAGE_SIZE = 5;
      const pageNumber = page_number;
      const discussPosts = await this.postRepository.find({
        relations: ['department', 'user'],
        where: {
          department: {
            id: department_id,
          },
          type: PostTypeEnum.DISCUSS,
        },
        order: {
          updatedAt: 'DESC',
        },
        skip: (pageNumber - 1) * PAGE_SIZE, // 计算跳过的数据量
        take: PAGE_SIZE, // 设置每页取得的数据数量
      });
      const discussPostsToLength = await this.postRepository.find({
        relations: ['department'],
        where: {
          department: {
            id: department_id,
          },
          type: PostTypeEnum.DISCUSS,
        },
      });
      const length = discussPostsToLength.length;
      // console.log(discussPosts);
      return { discussPosts, length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllHelpPostsInDepartmentTakePage(
    req: Request,
    department_id: number,
    page_number: number,
  ) {
    try {
      const PAGE_SIZE = 5;
      const pageNumber = page_number;
      const helpPosts = await this.postRepository.find({
        relations: ['department', 'user'],
        where: {
          department: {
            id: department_id,
          },
          type: PostTypeEnum.HELP,
        },
        order: {
          updatedAt: 'DESC',
        },
        skip: (pageNumber - 1) * PAGE_SIZE, // 计算跳过的数据量
        take: PAGE_SIZE, // 设置每页取得的数据数量
      });
      const helpPostsToLength = await this.postRepository.find({
        relations: ['department'],
        where: {
          department: {
            id: department_id,
          },
          type: PostTypeEnum.HELP,
        },
      });
      const length = helpPostsToLength.length;
      // console.log(discussPosts);
      return { helpPosts, length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Admin
  public async getAllPosts(req: Request, page_number: number) {
    try {
      const PAGE_SIZE = 5;
      const pageNumber = page_number;
      const { user } = req;
      if (user.role !== RoleEnum.ADMIN)
        throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
      const posts = await this.postRepository.find({
        relations: ['department', 'user'],
        order: {
          updatedAt: 'DESC',
        },
        skip: (pageNumber - 1) * PAGE_SIZE, // 计算跳过的数据量
        take: PAGE_SIZE, // 设置每页取得的数据数量
      });
      return posts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAllPostsStu(req: Request, page_number: number) {
    try {
      const PAGE_SIZE = 10;
      const pageNumber = page_number;
      const { user } = req;
      const posts = await this.postRepository.find({
        relations: ['department', 'user'],
        order: {
          updatedAt: 'DESC',
        },
        skip: (pageNumber - 1) * PAGE_SIZE, // 计算跳过的数据量
        take: PAGE_SIZE, // 设置每页取得的数据数量
      });
      return posts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Admin
  public async getHeaderAllPosts(req: Request, page_number: number) {
    try {
      const PAGE_SIZE = 5;
      const pageNumber = page_number;
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not Header', HttpStatus.FORBIDDEN);
      const user2 = await this.userService.getById(user.id);
      const posts = await this.postRepository.find({
        relations: ['department', 'user'],
        order: {
          updatedAt: 'DESC',
        },
        where: {
          department: {
            id: user2.ownDepartment.id,
          },
        },
        skip: (pageNumber - 1) * PAGE_SIZE, // 计算跳过的数据量
        take: PAGE_SIZE, // 设置每页取得的数据数量
      });
      return posts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Admin
  public async getAllPostsLength(req: Request) {
    try {
      const { user } = req;
      if (user.role !== RoleEnum.ADMIN)
        throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
      const posts = await this.postRepository.find({});
      return posts.length;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // STU
  public async getAllPostsLengthStu(req: Request) {
    try {
      const { user } = req;
      // if (user.role !== RoleEnum.ADMIN)
      //   throw new HttpException('You are not admin', HttpStatus.FORBIDDEN);
      const posts = await this.postRepository.find({});
      return posts.length;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // header
  public async getHeaderAllPostsLength(req: Request) {
    try {
      const { user } = req;
      if (user.level !== LevelEnum.HEADER)
        throw new HttpException('You are not header', HttpStatus.FORBIDDEN);
      console.log(user.id);
      const user2 = await this.userService.getById(user.id);
      console.log(user2.ownDepartment.id);
      const posts = await this.postRepository.find({
        where: {
          department: {
            id: user2.ownDepartment.id,
          },
        },
      });
      return posts.length;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // public async getAllDiscussPostsInDepartmentLength(
  //   req: Request,
  //   department_id: number,
  // ) {
  //   try {
  //     const discussPosts = await this.postRepository.find({
  //       relations: ['department'],
  //       where: {
  //         department: {
  //           id: department_id,
  //         },
  //         type: PostTypeEnum.DISCUSS,
  //       },
  //     });
  //     // console.log(discussPosts);
  //     return discussPosts.length;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  public async getAllPostsByUserId(req: Request) {
    try {
      const { user } = req;
      const posts = await this.postRepository.find({
        relations: ['user', 'department'],
        where: {
          user: {
            id: user.id,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return posts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async deletePost(req: Request, id: number) {
    try {
      const { user } = req;
      const post = await this.postRepository.findOne({
        relations: ['user', 'department'],
        where: {
          id,
        },
      });
      if (
        //admin、header和自己可以删除
        (user.role !== RoleEnum.ADMIN && post.user.id !== user.id) ||
        (user.level !== LevelEnum.HEADER && post.user.id !== user.id)
      ) {
        throw new HttpException(
          'You do not have the right',
          HttpStatus.FORBIDDEN,
        );
      }
      await this.postRepository.delete(id);
      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
