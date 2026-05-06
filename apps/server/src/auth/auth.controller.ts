import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  RegisterBodyDto,
  LoginBodyDto,
  RefreshBodyDto,
  AuthTokensDto,
} from './dto/auth.dto.js';
import { AuthService } from './auth.service.js';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, type: AuthTokensDto })
  @Public()
  @Post('register')
  registerUser(@Body() registerDto: RegisterBodyDto) {
    return this.authService.registerUser(registerDto);
  }

  @ApiResponse({ status: 200, type: AuthTokensDto })
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginBodyDto) {
    return this.authService.login(loginDto);
  }

  @ApiResponse({ status: 200, type: AuthTokensDto })
  @Public()
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshBodyDto) {
    return this.authService.refresh(refreshDto);
  }
}
