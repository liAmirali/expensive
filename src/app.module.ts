import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { GroupModule } from './group/group.module';

@Module({
  imports: [AuthModule, UsersModule, GroupModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
