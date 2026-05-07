import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../generated/prisma/client.js';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class MeDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ required: false })
  avatarUrl?: string | null;

  @ApiProperty({ required: false })
  phoneNumber?: string | null;

  @ApiProperty()
  preferredCurrency: string;

  @ApiProperty()
  preferredLocale: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  passwordHash: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}

export class UpdateMeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredCurrency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredLocale?: string;
}

export class UserPublicDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
  }
}
