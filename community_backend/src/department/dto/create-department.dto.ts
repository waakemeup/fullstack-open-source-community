import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class CreateDepartmentDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  // Community title represent the topic an you change it at any time.
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(80)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description: string;

  @IsNumber()
  @IsOptional()
  userId: number;
}
