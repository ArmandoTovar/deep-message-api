import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorResponseNormalizerFilter } from './response-normalizer/error-response-normalizer.filter';
import { SuccessResponseNormalizerInterceptor } from './response-normalizer/success-response-normalizer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: ['http://localhost:4000'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(app.get(ErrorResponseNormalizerFilter));
  app.useGlobalInterceptors(
    app.get(SuccessResponseNormalizerInterceptor),
  );
  const config = new DocumentBuilder()
    .setTitle('Messaging API')
    .setDescription(
      'API for user messaging, allowing users to send, read, and manage messages',
    )
    .setVersion('1.0')
    .addTag('messages', 'Operations related to messaging between users')
    .addBearerAuth() // Añadir soporte para autenticación Bearer
    .addServer('http://localhost:3000', 'dev server') // Añadir servidor para Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
