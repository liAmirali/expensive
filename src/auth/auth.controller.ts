import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterBodyDto, SignInBodyDto, SignInResponseDto } from './dto/auth.dto.js';
import { AuthService } from './auth.service.js';
import { Public } from './auth.gaurd.js';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeDTO } from '../users/dto/user.dto.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, type: SignInResponseDto })
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInBodyDto) {
    return this.authService.signIn(signInDto.userIdentifier, signInDto.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 201, type: MeDTO })
  @Public()
  @Post('register')
  async registerUser(@Body() registerDto: RegisterBodyDto) {
    return new MeDTO(await this.authService.registerUser(registerDto));
  }
}
