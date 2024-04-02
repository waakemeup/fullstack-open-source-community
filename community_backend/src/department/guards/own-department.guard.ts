import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import Department from '../department.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import RoleEnum from '../../shared/enums/RoleEnum';

export class OwnDepartmentGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {
    super();
  }
  // Override handleRequest so it never throws an error
  //@ts-ignore
  async handleRequest(err, user, info, context) {
    const req = context.switchToHttp().getRequest();
    const department = await this.departmentRepository.findOneOrFail({
      where: { name: req.params.name },
    });
    // TODO:
    // if (user.id !== department.userId || err) {
    if (
      (user.id !== department.userId && user.role !== RoleEnum.ADMIN) ||
      err
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: `You don't own this department`,
          error: `Forbidden`,
        },
        403,
      );
    }
    req.department = department;
    return user;
  }
}
