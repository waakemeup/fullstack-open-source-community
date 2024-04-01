import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import LevelEnum from '../../shared/enums/LevelEnum';
import RoleEnum from '../../shared/enums/RoleEnum';

export default class CreateUserDTO {
  @IsEmail()
  @Length(2, 80)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 80)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 80)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 80)
  password: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;

  @IsEnum(LevelEnum)
  @IsNotEmpty()
  level: LevelEnum;
}
