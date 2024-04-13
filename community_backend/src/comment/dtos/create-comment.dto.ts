import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  NotEquals,
} from 'class-validator';

export default class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(2000)
  @NotEquals('<p><br></p>', {
    message: '评论不可为空',
  })
  body: string;
}
