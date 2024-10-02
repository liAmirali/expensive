import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto, SignInDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(
      signInDto.userIdentifier,
      signInDto.password,
    );
  }

  @Post('register')
  registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
}
