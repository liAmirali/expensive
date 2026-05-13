# Server App

NestJS + Prisma + PostgreSQL. REST API for the Expensive client.

## Stack
- **Framework**: NestJS (module/controller/service pattern)
- **ORM**: Prisma — schema at `src/prisma/schema.prisma`, generated client at `src/generated/`
- **Validation**: `class-validator` + `class-transformer` on all DTOs. Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- **Auth**: JWT (see `src/auth/`)
- **Docs**: Swagger auto-generated via `@nestjs/swagger` decorators

## Structure
```
src/auth/         JWT auth module
src/users/        user CRUD
src/group/        group management
src/ledgers/      ledger per group
src/expenses/     expense entries
src/balances/     balance calculation
src/settlements/  settlement records
src/common/       shared guards, decorators, pipes
src/config/       env config (ConfigModule)
```

## Rules
- Every endpoint input goes through a DTO with `class-validator` decorators — never accept raw `body` objects
- Never query Prisma directly in controllers — always via service methods
- New modules: generate with NestJS CLI, register in `AppModule`
- Prisma migrations: `pnpm prisma migrate dev` — never edit generated files in `src/generated/`
