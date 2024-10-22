import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsValidUsername } from 'src/users/validators/username-validator';

export class SignInBodyDto {
  @ApiProperty()
  userIdentifier: string;

  @ApiProperty()
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class RegisterBodyDto {
  @ApiProperty()
  @IsString()
  @IsValidUsername()
  username: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
}
