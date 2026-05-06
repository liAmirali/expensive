import { plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { validateSync } from 'class-validator';

export class EnvConfig {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsInt()
  @Min(1)
  JWT_ACCESS_TTL_SECONDS!: number;

  @IsInt()
  @Min(1)
  JWT_REFRESH_TTL_SECONDS!: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  APP_PORT?: number;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvConfig, {
    ...config,
    JWT_ACCESS_TTL_SECONDS: Number(config.JWT_ACCESS_TTL_SECONDS ?? 900),
    JWT_REFRESH_TTL_SECONDS: Number(config.JWT_REFRESH_TTL_SECONDS ?? 1209600),
    APP_PORT: Number(config.APP_PORT ?? 3000),
  });

  const errors = validateSync(validated, { whitelist: true });
  if (errors.length > 0) {
    const message = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Invalid environment variables: ${message}`);
  }
  return validated;
}
