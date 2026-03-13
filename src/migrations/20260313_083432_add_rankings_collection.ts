import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_rankings_weight_class" AS ENUM('Strawweight (bis 52 kg)', 'Flyweight (bis 57 kg)', 'Bantamweight (bis 61 kg)', 'Featherweight (bis 66 kg)', 'Lightweight (bis 70 kg)', 'Welterweight (bis 77 kg)', 'Middleweight (bis 84 kg)', 'Light Heavyweight (bis 93 kg)', 'Heavyweight (bis 120 kg)');
  CREATE TYPE "public"."enum_rankings_region" AS ENUM('europe', 'germany', 'hessen');
  CREATE TABLE "rankings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fighter_id" integer NOT NULL,
  	"weight_class" "enum_rankings_weight_class" NOT NULL,
  	"region" "enum_rankings_region" NOT NULL,
  	"position" numeric NOT NULL,
  	"label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rankings_id" integer;
  ALTER TABLE "rankings" ADD CONSTRAINT "rankings_fighter_id_fighters_id_fk" FOREIGN KEY ("fighter_id") REFERENCES "public"."fighters"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "rankings_fighter_idx" ON "rankings" USING btree ("fighter_id");
  CREATE INDEX "rankings_updated_at_idx" ON "rankings" USING btree ("updated_at");
  CREATE INDEX "rankings_created_at_idx" ON "rankings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rankings_fk" FOREIGN KEY ("rankings_id") REFERENCES "public"."rankings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_rankings_id_idx" ON "payload_locked_documents_rels" USING btree ("rankings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rankings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rankings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rankings_fk";
  
  DROP INDEX "payload_locked_documents_rels_rankings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rankings_id";
  DROP TYPE "public"."enum_rankings_weight_class";
  DROP TYPE "public"."enum_rankings_region";`)
}
