import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as path from 'node:path';

const projectRoot = path.join(__dirname, '../../../apps/context-gpt-backend');
const isDevelopment = process.env.NODE_ENV === 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  if (isDevelopment) {
    // Swagger configuration (only in development mode)
    const config = new DocumentBuilder()
      .setTitle('Context-GPT API')
      .setDescription('The Context-GPT API description')
      .setVersion('1.0')
      .addTag('context-gpt')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    const swaggerSpecPath = path.join(projectRoot, 'swagger-spec.json');

    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);

  if (isDevelopment) {
    Logger.log(`📚 Swagger documentation is available at: http://localhost:${port}/${globalPrefix}/docs`);
  }
}

bootstrap();
