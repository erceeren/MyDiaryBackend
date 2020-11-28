import {MigrationInterface, QueryRunner} from "typeorm";

export class DiaryDateMigration1606166789629 implements MigrationInterface {
    name = 'DiaryDateMigration1606166789629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" RENAME COLUMN "created_at" TO "date"`);
        await queryRunner.query(`ALTER TABLE "diary" ADD CONSTRAINT "uniqueuserdate" UNIQUE ("userId", "date")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP CONSTRAINT "uniqueuserdate"`);
        await queryRunner.query(`ALTER TABLE "diary" RENAME COLUMN "date" TO "created_at"`);
    }

}
