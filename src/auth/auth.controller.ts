import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto, SignInDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.gaurd';
import { ApiTags } from '@nestjs/swagger';
import { MeDTO } from 'src/users/dto/user.dto';

@ApiTags('Authentication')
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
  async registerUser(@Body() registerDto: RegisterDto) {
    return new MeDTO(await this.authService.registerUser(registerDto));
  }
}
