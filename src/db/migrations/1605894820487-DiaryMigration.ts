import {MigrationInterface, QueryRunner} from "typeorm";

export class DiaryMigration1605894820487 implements MigrationInterface {
    name = 'DiaryMigration1605894820487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "diary" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_7422c55a0908c4271ff1918437d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "diary" ADD CONSTRAINT "FK_bda48d3f2d272ca20f3aa612e5c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diary" DROP CONSTRAINT "FK_bda48d3f2d272ca20f3aa612e5c"`);
        await queryRunner.query(`DROP TABLE "diary"`);
    }

}
