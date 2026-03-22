import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_fighters_gender" AS ENUM('male', 'female');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'fan';
  CREATE TABLE "hall_of_fame_achievements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "hall_of_fame" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"active_years" varchar NOT NULL,
  	"bio" varchar,
  	"legacy" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "username" varchar NOT NULL;
  ALTER TABLE "fighters" ADD COLUMN "gender" "enum_fighters_gender" DEFAULT 'male' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hall_of_fame_id" integer;
  ALTER TABLE "hall_of_fame_achievements" ADD CONSTRAINT "hall_of_fame_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hall_of_fame"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hall_of_fame" ADD CONSTRAINT "hall_of_fame_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "hall_of_fame_achievements_order_idx" ON "hall_of_fame_achievements" USING btree ("_order");
  CREATE INDEX "hall_of_fame_achievements_parent_id_idx" ON "hall_of_fame_achievements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hall_of_fame_slug_idx" ON "hall_of_fame" USING btree ("slug");
  CREATE INDEX "hall_of_fame_image_idx" ON "hall_of_fame" USING btree ("image_id");
  CREATE INDEX "hall_of_fame_updated_at_idx" ON "hall_of_fame" USING btree ("updated_at");
  CREATE INDEX "hall_of_fame_created_at_idx" ON "hall_of_fame" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hall_of_fame_fk" FOREIGN KEY ("hall_of_fame_id") REFERENCES "public"."hall_of_fame"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "payload_locked_documents_rels_hall_of_fame_id_idx" ON "payload_locked_documents_rels" USING btree ("hall_of_fame_id");
  ALTER TABLE "users" DROP COLUMN "gym_name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hall_of_fame_achievements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hall_of_fame" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "hall_of_fame_achievements" CASCADE;
  DROP TABLE "hall_of_fame" CASCADE;
  ALTER TABLE "users" RENAME COLUMN "username" TO "gym_name";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_hall_of_fame_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'multimedia');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "users_username_idx";
  DROP INDEX "payload_locked_documents_rels_hall_of_fame_id_idx";
  ALTER TABLE "fighters" DROP COLUMN "gender";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hall_of_fame_id";
  DROP TYPE "public"."enum_fighters_gender";`)
}
