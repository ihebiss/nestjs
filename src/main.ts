import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationException,
  ValidationFilter,
} from './utils/filter.validation'
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   
   app.enableCors({
    origin: 'http://localhost:5000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const errMsg = {};
        errors.forEach((err) => {
          errMsg[err.property] = [...Object.values(err.constraints)];
        });
        return new ValidationException(errMsg);
      },
    }),
  );
  //await app.listen(3001);
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
