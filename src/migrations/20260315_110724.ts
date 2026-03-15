import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_news_status" AS ENUM('published', 'draft');
  ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN "gym_name" varchar;
  ALTER TABLE "events" ADD COLUMN "description" varchar;
  ALTER TABLE "events" ADD COLUMN "event_image_id" integer;
  ALTER TABLE "news" ADD COLUMN "category" varchar;
  ALTER TABLE "news" ADD COLUMN "status" "enum_news_status" DEFAULT 'published';
  ALTER TABLE "events" ADD CONSTRAINT "events_event_image_id_media_id_fk" FOREIGN KEY ("event_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_event_image_idx" ON "events" USING btree ("event_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP CONSTRAINT "events_event_image_id_media_id_fk";
  
  DROP INDEX "events_event_image_idx";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "gym_name";
  ALTER TABLE "events" DROP COLUMN "description";
  ALTER TABLE "events" DROP COLUMN "event_image_id";
  ALTER TABLE "news" DROP COLUMN "category";
  ALTER TABLE "news" DROP COLUMN "status";
  DROP TYPE "public"."enum_news_status";`)
}
