import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterBodyDto } from './dto/auth.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    // The sent username parameter can be a username or an email
    const user = await this.usersService.identifyOne(username);

    if (!user) throw new UnauthorizedException("User doesn't exist");

    // Checking password
    const passwordsMatch = await bcrypt.compare(pass, user.password);
    if (!passwordsMatch) throw new UnauthorizedException('Invalid password');

    // Creating JWT token
    const jwtPayload = { id: user.id, username: user.username };

    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return {
      accessToken,
    };
  }

  async registerUser(registerDto: RegisterBodyDto) {
    const user = await this.usersService.createUser(registerDto);

    return user;
  }
}
