import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './user/user.model';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await User.sync({ force: true });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
