import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { IpWhitelistMiddleware } from './middleware/ip-whitelist.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  const config = new DocumentBuilder()
    .setTitle('Stars365 API')
    .setDescription('API documentation for Telegram authentication')
    .setVersion('1.0')
    .addTag('auth')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(IpWhitelistMiddleware);
  await app.listen(8000);
}
bootstrap();