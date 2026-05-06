import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove non-decorated properties
      forbidNonWhitelisted: true, // Throw an error when extra properties are provided
      transform: true, // Automatically transform payloads to match DTO types
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error) => {
          return {
            field: error.property,
            errors: Object.values(error.constraints ?? {}),
          };
        });
        return new BadRequestException(formattedErrors);
      },
    }),
  );

  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Expensive APIs')
    .setDescription('The API description for the Expensive app.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(Number(process.env.APP_PORT ?? 3000));
}
void bootstrap();
