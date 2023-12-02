import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const log = new LoggerService(AppModule.name);
  const config = new DocumentBuilder()
    .setTitle('PokeInfo')
    .setDescription('The pokemon info API description')
    .setVersion('1.0')
    .addTag('PokeInfo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const PORT = process.env.PORT || 9000;
  await app.listen(PORT, () => {
    log.verbose(`app is running on http://localhost:${PORT}`);
    log.verbose(`app docs http://localhost:${PORT}/docs`);
  });
}
bootstrap();
