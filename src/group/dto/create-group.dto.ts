import { Optional } from '@nestjs/common';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Optional()
  description: string;

  @Optional()
  members: ID[];
}
