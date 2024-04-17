import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
} from 'class-validator';

export default class CreateContestDTO {
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
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  max: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  min: number;

  // 社团名称
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  department: string;
}
