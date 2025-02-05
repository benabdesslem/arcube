import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener')
    .setDescription('API for URL Shortener')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;

  await app.listen(port, '0.0.0.0');

  const frontendUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() || 'http://localhost:3000';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(
    `📄 Swagger UI available at http://localhost:${port}/api/docs`,
    'Swagger',
  );
}

bootstrap();
