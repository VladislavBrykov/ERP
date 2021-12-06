import * as bcrypt from 'bcrypt';
import {MigrationInterface, QueryRunner} from "typeorm";
import { User } from '../entities/User';

export class User1634125869393 implements MigrationInterface {
    name = 'User1634125869393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        // ADD ADMIN USER
        await queryRunner.manager.insert(User, {
          firstName: 'admin',
          lastName: 'admin',
          email: 'team@bandapixels.com',
          password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 11),
          isAdmin: true,
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
