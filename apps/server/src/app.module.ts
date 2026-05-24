import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { GroupModule } from './group/group.module.js';
import { LedgersModule } from './ledgers/ledgers.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { SettlementsModule } from './settlements/settlements.module.js';
import { BalancesModule } from './balances/balances.module.js';
import { validateEnv } from './config/env.validation.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    AuthModule,
    UsersModule,
    GroupModule,
    LedgersModule,
    ExpensesModule,
    SettlementsModule,
    BalancesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
