import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_news_status" AS ENUM('published', 'draft');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))
  await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" varchar`)
  await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "gym_name" varchar`)
  await db.execute(sql`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "description" varchar`)
  await db.execute(sql`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "event_image_id" integer`)
  await db.execute(sql`ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "category" varchar`)
  await db.execute(sql`ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "status" "enum_news_status" DEFAULT 'published'`)
  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "events" ADD CONSTRAINT "events_event_image_id_media_id_fk"
        FOREIGN KEY ("event_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "events_event_image_idx" ON "events" USING btree ("event_image_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_event_image_id_media_id_fk"`)
  await db.execute(sql`DROP INDEX IF EXISTS "events_event_image_idx"`)
  await db.execute(sql`ALTER TABLE "users" DROP COLUMN IF EXISTS "name"`)
  await db.execute(sql`ALTER TABLE "users" DROP COLUMN IF EXISTS "gym_name"`)
  await db.execute(sql`ALTER TABLE "events" DROP COLUMN IF EXISTS "description"`)
  await db.execute(sql`ALTER TABLE "events" DROP COLUMN IF EXISTS "event_image_id"`)
  await db.execute(sql`ALTER TABLE "news" DROP COLUMN IF EXISTS "category"`)
  await db.execute(sql`ALTER TABLE "news" DROP COLUMN IF EXISTS "status"`)
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_news_status"`))
}
