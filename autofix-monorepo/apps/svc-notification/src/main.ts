import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule);

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('AutoFix Notification Service')
        .setDescription('Notification microservice for the AutoFix platform. Handles Email, SMS, WhatsApp and Push Notifications.')
        .setVersion('1.0')
        .addTag('Notifications')
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

    // CORS
    app.enableCors();

    const port = process.env.PORT || 3003;

    await app.listen(port);

    logger.log(`🚀 svc-notification is running on: http://localhost:${port}`);
    logger.log(`🚀 swagger documentation at: http://localhost:${port}/api/docs`);
}

bootstrap();
