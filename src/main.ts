import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  await app.listen(parseInt(process.env.API_PORT), () =>
    console.log(`Server is running on port ${process.env.API_PORT}`),
  );
}
bootstrap();
