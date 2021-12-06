import { join } from 'path';
import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { User } from '../entities/User';
import { User1634125869393 } from '../migrations/1634125869393-User';
import { AuthModule } from './auth/auth.module';
import LoggingMiddleware from "../middlewares/logger.middleware";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    TerminusModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User],
      synchronize: false,
      migrationsRun: true,
      migrations: [User1634125869393],
    }),
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '/auth/sign-in', method: RequestMethod.POST });
  }
}
