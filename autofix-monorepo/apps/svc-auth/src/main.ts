import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infra/api/filters/global-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('AutoFix Auth Service')
        .setDescription('Authentication and Authorization service for the AutoFix platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Global pipes
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Global filters
    app.useGlobalFilters(new GlobalExceptionFilter());

    // CORS
    app.enableCors();

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 svc-auth is running on: http://localhost:${port}`);
    console.log(`🚀 svc-auth is running on: http://localhost:${port}/api/docs`);
}

bootstrap();
