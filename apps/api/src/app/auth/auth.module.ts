import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { User } from '../../entities/User';
import { ZodValidationForSignInMiddleware } from '../../middlewares/zod.validation.sign.in.middlewares';
import CheckSessionIdExistsMiddlewares from '../../middlewares/check.sessionId.exists.middlewares';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, LocalSerializer, LocalStrategy],
  exports: [TypeOrmModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckSessionIdExistsMiddlewares, ZodValidationForSignInMiddleware)
      .forRoutes({ path: '/auth/sign-in', method: RequestMethod.POST });
  }
}
