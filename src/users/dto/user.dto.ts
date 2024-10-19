import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MeDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  isVerified: boolean;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export class UserFullDTO {
  id: number;
  firstName: string;
  lastName: string;
  username: string;

  @Exclude()
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  salt: string;
  @Exclude()
  isVerified: boolean;
}
