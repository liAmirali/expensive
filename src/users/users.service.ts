import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '../generated/prisma/client.js';
import { RegisterBodyDto } from '../auth/dto/auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateMeDto } from './dto/user.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: ID): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: RegisterBodyDto & { passwordHash: string }): Promise<User> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          email: data.email,
          fullName: data.fullName,
          avatarUrl: data.avatarUrl ?? null,
          phoneNumber: data.phoneNumber ?? null,
          defaultCurrency: data.defaultCurrency ?? 'IRR',
          preferredLocale: data.preferredLocale ?? 'fa-IR',
          passwordHash: data.passwordHash,
        },
      });

      return createdUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;

          if (target?.includes('email')) {
            throw new ConflictException('Email is already taken.');
          }
        }
      }
      throw error;
    }
  }

  async search(query: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            fullName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async updateMe(userId: ID, data: UpdateMeDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
        phoneNumber: data.phoneNumber,
        defaultCurrency: data.defaultCurrency,
        preferredLocale: data.preferredLocale,
      },
    });
  }
}
