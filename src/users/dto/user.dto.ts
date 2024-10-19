import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MeDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  isVerified: boolean;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export class UserFullDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  username: string;

  @Exclude()
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  salt: string;
  @Exclude()
  isVerified: boolean;
}
