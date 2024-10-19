import { ApiProperty } from '@nestjs/swagger';

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
