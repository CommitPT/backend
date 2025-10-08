import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CommitPT Backend API')
    .setDescription('Backend for Commit PT Platform')
    .setVersion(process.env.API_VERSION || '1.0.0')
    .addTag('Authentication')
    .setBasePath('api/v1')
    .addServer(process.env.API_URL || 'http://localhost:3000/api/v1', 'Development server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });

  //writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  console.log('✅ Swagger JSON file generated at ./openapi.json');

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
