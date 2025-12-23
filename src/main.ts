/* eslint-disable @typescript-eslint/no-unsafe-call */
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());
  const redis = new Redis(/* your config */);

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
  // Optionally: don't rethrow or crash
});

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  const port = process.env.PORT! || 3000;
  await app.listen(process.env.PORT ?? port);
  console.log(`the server running at http://localhost:${port}/api`);
}
bootstrap();
