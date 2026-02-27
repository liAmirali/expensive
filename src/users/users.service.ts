import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '../generated/prisma/client.js';
import { RegisterBodyDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * It finds a user with the user identifier and returns it or returns null
   * @param userIdentifier This can be the user's username or their email or maybe their phone number.
   */
  async identifyOne(userIdentifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: userIdentifier,
          },
          {
            email: userIdentifier,
          },
        ],
      },
    });
  }

  async findById(userId: ID): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Creates a user based on the data provided
   * @param data The data to create a new user
   */
  async createUser(data: RegisterBodyDto): Promise<User> {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(data.password, salt);

    try {
      const cratedUser = await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: hashedPassword,
          salt: salt,
        },
      });

      return cratedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;

          if (target.includes('username')) {
            throw new ConflictException('Username is already taken.');
          } else if (target.includes('email')) {
            throw new ConflictException('Email is already taken.');
          }
        }
      }
      throw error;
    }
  }

  /**
   * It searches for a user based on the query provided on the username, first name, or last name fields
   * @param query The query to search for
   */
  async search(query: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
            },
          },
          {
            firstName: {
              contains: query,
            },
          },
          {
            lastName: {
              contains: query,
            },
          },
        ],
      },
    });
  }
}
