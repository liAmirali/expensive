import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AppModule } from './app.module.js';

async function dump() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Expensive APIs')
    .setDescription('The API description for the Expensive app.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const out = resolve(process.cwd(), 'openapi.json');
  writeFileSync(out, JSON.stringify(document, null, 2));
  console.log(`openapi spec written to ${out}`);
  await app.close();
}

void dump();
