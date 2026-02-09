import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infra/api/filters/global-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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
}

bootstrap();
