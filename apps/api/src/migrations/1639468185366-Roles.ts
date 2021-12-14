import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../entities/Role';

export class Roles1639468185366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.manager.insert(Role, {
      role: 'PM'
    });
    await queryRunner.manager.insert(Role, {
      role: 'TL'
    });
    await queryRunner.manager.insert(Role, {
      role: 'DEV'
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
