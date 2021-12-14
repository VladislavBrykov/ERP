import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvValidation } from '@erp/validation';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { User } from '../entities/User';
import { User1634125869393 } from '../migrations/1634125869393-User';
import { AuthModule } from './auth/auth.module';
import { Role } from '../entities/Role';
import { Roles1639468185366 } from '../migrations/1639468185366-Roles';
import {UpdateUserAndMakeRelation1639472167667} from "../migrations/1639472167667-UpdateUserAndMakeRelation";

const env = EnvValidation.parse(process.env);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    TerminusModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: env.DATABASE_URL,
      entities: [Role, User],
      synchronize: false,
      migrationsRun: true,
      migrations: [
        Roles1639468185366,
        User1634125869393,
        UpdateUserAndMakeRelation1639472167667,
      ],
    }),
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
