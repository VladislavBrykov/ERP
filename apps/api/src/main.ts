/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import passport from 'passport';

import { AppModule } from './app/app.module';
import AllExceptionsFilter from './common/filter/all-exception.filter';
import { EnvValidation } from '@erp/validation';
export const env = EnvValidation.parse(process.env);

dotenv.config();

const client = createClient({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.use(cookieParser());

  const RedisStore = connectRedis(session);

  app.use(
    session({
      secret: env.SECRET_KEY_SESSION,
      cookie: {
        maxAge: env.SESSION_EXPIRE_TIME, // 1 hour
      },
      store: new RedisStore({ client, ttl: env.REDIS_EXPIRE_TIME }),
      saveUninitialized: true,
      resave: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalFilters(new AllExceptionsFilter());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = env.PORT || 3333;

  const config = new DocumentBuilder()
    .setTitle('erp')
    .setVersion('1.0')
    .addTag('erp')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
