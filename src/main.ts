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
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () =>
    log.verbose(`app is runnig on http://localhost:${PORT}`),
  );
}
bootstrap();
