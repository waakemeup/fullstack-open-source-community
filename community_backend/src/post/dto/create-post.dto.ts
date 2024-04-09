import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import PostTypeEnum from '../../shared/enums/PostTypeEnum';

export default class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  body: string;

  // 社团名称
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  department: string;

  @IsEnum(PostTypeEnum)
  @IsNotEmpty()
  type: PostTypeEnum;
}
