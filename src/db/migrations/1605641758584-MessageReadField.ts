import {MigrationInterface, QueryRunner} from "typeorm";

export class MessageReadField1605641758584 implements MigrationInterface {
    name = 'MessageReadField1605641758584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "read" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "read"`);
    }

}
