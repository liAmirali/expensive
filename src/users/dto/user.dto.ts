import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../generated/prisma/client.js';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import { IsValidUsername } from '../validators/username-validator.js';

export class MeDTO {
  @ApiProperty()
  @IsNumber()
  id: ID;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsBoolean()
  isVerified: boolean;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export class UserPublicDTO {
  @ApiProperty()
  @IsNumber()
  id: ID;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsValidUsername()
  username: string;

  @Exclude()
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  salt: string;
  @Exclude()
  isVerified: boolean;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
