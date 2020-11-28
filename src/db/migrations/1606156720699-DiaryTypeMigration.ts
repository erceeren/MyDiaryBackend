import {MigrationInterface, QueryRunner} from "typeorm";

export class DiaryTypeMigration1606156720699 implements MigrationInterface {
    name = 'DiaryTypeMigration1606156720699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "diary_type_enum" AS ENUM('private', 'public', 'friends')`);
        await queryRunner.query(`ALTER TABLE "diary" ADD "type" "diary_type_enum" NOT NULL DEFAULT 'private'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "diary_type_enum"`);
    }

}
