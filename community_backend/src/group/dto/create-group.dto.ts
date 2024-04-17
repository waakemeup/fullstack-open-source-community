import { IsString, MaxLength, MinLength } from 'class-validator';

export default class CreateGroupDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;
}
