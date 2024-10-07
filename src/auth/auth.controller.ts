import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto, SignInDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.gaurd';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(
      signInDto.userIdentifier,
      signInDto.password,
    );
  }

  @Post('register')
  @Public()
  registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
}
