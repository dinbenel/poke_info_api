import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}
bootstrap();
