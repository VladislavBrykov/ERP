import {MigrationInterface, QueryRunner} from "typeorm";
import bcrypt from "bcrypt";
import {EnvValidation} from "@erp/validation";

import {User} from "../entities/User";

const env = EnvValidation.parse(process.env);

export class UpdateUserAndMakeRelation1639472167667 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "user"
            ADD COLUMN "phone" character varying NOT NULL,
            ADD COLUMN "roleId" integer,
            ADD COLUMN "passportSeries" character varying,
            ADD COLUMN "inn" character varying,
            ADD COLUMN "dateOfBirthday" character varying,
            ADD COLUMN "isRemoved" boolean default false,
            ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id")`
      );

      await queryRunner.manager.insert(User, {
        firstName: 'admin',
        lastName: 'admin',
        email: 'team@bandapixels.com',
        password: await bcrypt.hash(env.ADMIN_PASSWORD, env.BCRYPT_HASH),
        role: 3,
        isAdmin: true,
        phone: '+3802020202',
      });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
