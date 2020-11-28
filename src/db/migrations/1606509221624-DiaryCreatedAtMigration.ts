import {MigrationInterface, QueryRunner} from "typeorm";

export class DiaryCreatedAtMigration1606509221624 implements MigrationInterface {
    name = 'DiaryCreatedAtMigration1606509221624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" ADD "created_at" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "created_at"`);
    }

}
