import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.API_PREFIX || '';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('ContextGpt API')
    .setDescription('API for interacting with the ContextGpt application')
    .setVersion('1.0')
    .addTag('context-gpt')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
