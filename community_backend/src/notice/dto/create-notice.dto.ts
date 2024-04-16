import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator';

export default class CreateNoticeDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(5000)
  @NotEquals('<p><br></p>', {
    message: '评论不可为空',
  })
  body: string;

  // 社团名称
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  department: string;
}
