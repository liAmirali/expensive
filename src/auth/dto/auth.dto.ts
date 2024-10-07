import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  userIdentifier: string;

  @ApiProperty()
  password: string;
}

export class RegisterDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
