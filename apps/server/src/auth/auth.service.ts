import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterBodyDto, LoginBodyDto, RefreshBodyDto } from './dto/auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import argon2 from 'argon2';
import { Prisma } from '../generated/prisma/client.js';
import { RefreshTokenPayload } from './types/token.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private get accessTtlSeconds(): number {
    return Number(this.configService.get('JWT_ACCESS_TTL_SECONDS'));
  }

  private get refreshTtlSeconds(): number {
    return Number(this.configService.get('JWT_REFRESH_TTL_SECONDS'));
  }

  private get accessSecret(): string {
    return this.configService.getOrThrow('JWT_ACCESS_SECRET');
  }

  private get refreshSecret(): string {
    return this.configService.getOrThrow('JWT_REFRESH_SECRET');
  }

  async registerUser(registerDto: RegisterBodyDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email is already taken.');
    }

    const passwordHash = await argon2.hash(registerDto.password);

    const user = await this.usersService.createUser({
      ...registerDto,
      passwordHash,
    });

    return this.issueTokens(user.id, user.email);
  }

  async login(body: LoginBodyDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const valid = await argon2.verify(user.passwordHash, body.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.issueTokens(user.id, user.email);
  }

  async refresh(body: RefreshBodyDto) {
    const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(body.refreshToken, {
      secret: this.refreshSecret,
    });

    if (payload?.tokenType !== 'refresh' || !payload?.jti || !payload?.sub) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired.');
    }

    const tokenMatches = await argon2.verify(tokenRecord.tokenHash, body.refreshToken);
    if (!tokenMatches) {
      throw new UnauthorizedException('Refresh token mismatch.');
    }

    await this.prisma.refreshToken.update({
      where: { jti: payload.jti },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(payload.sub, payload.email);
  }

  private async issueTokens(userId: ID, email: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        tokenType: 'access',
      },
      {
        secret: this.accessSecret,
        expiresIn: this.accessTtlSeconds,
      },
    );

    const refreshJti = randomUUID();
    const refreshToken = await this.jwtService.signAsync<RefreshTokenPayload>(
      {
        sub: userId,
        email,
        jti: refreshJti,
        tokenType: 'refresh',
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshTtlSeconds,
      },
    );

    const expiresAt = new Date(Date.now() + this.refreshTtlSeconds * 1000);
    const tokenHash = await argon2.hash(refreshToken);

    try {
      await this.prisma.refreshToken.create({
        data: {
          userId,
          jti: refreshJti,
          tokenHash,
          expiresAt,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnauthorizedException('Token rotation conflict.');
        }
      }
      throw error;
    }

    return {
      accessToken,
      refreshToken,
    };
  }
}
