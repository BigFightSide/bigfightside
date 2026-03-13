import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fighters_fight_history_result" AS ENUM('win', 'loss', 'draw', 'no_contest');
  CREATE TABLE "fighters_fight_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"opponent" varchar NOT NULL,
  	"result" "enum_fighters_fight_history_result" NOT NULL,
  	"method" varchar,
  	"event" varchar,
  	"date" timestamp(3) with time zone
  );
  
  ALTER TABLE "fighters" ADD COLUMN "nationality" varchar;
  ALTER TABLE "fighters" ADD COLUMN "team" varchar;
  ALTER TABLE "fighters_fight_history" ADD CONSTRAINT "fighters_fight_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fighters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "fighters_fight_history_order_idx" ON "fighters_fight_history" USING btree ("_order");
  CREATE INDEX "fighters_fight_history_parent_id_idx" ON "fighters_fight_history" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "fighters_fight_history" CASCADE;
  ALTER TABLE "fighters" DROP COLUMN "nationality";
  ALTER TABLE "fighters" DROP COLUMN "team";
  DROP TYPE "public"."enum_fighters_fight_history_result";`)
}
