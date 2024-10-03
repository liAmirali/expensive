import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * It finds a user with the user identifier and returns it or returns null
   * @param userIdentifier This can be the user's username or their email or maybe their phone number.
   */
  async findOne(userIdentifier: string): Promise<User | null> {
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

  /**
   * Creates a user based on the data provided
   * @param data The data to create a new user
   */
  async createUser(data: RegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(data.password, salt);

    const cratedUser = this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: hashedPassword,
        salt: salt,
      },
    });

    return cratedUser;
  }
}
