import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  RegisterBodyDto,
  SignInBodyDto,
  SignInResponseDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.gaurd';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeDTO } from 'src/users/dto/user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, type: SignInResponseDto })
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInBodyDto) {
    return this.authService.signIn(
      signInDto.userIdentifier,
      signInDto.password,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, type: MeDTO })
  @Public()
  @Post('register')
  async registerUser(@Body() registerDto: RegisterBodyDto) {
    return new MeDTO(await this.authService.registerUser(registerDto));
  }
}
