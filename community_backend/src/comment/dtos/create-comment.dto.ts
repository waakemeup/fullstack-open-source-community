import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  NotEquals,
  IsOptional,
} from 'class-validator';
import User from '../../user/user.entity';

export default class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(2000)
  @NotEquals('<p><br></p>', {
    message: '评论不可为空',
  })
  body: string;

  @IsOptional()
  user?: User;
}
