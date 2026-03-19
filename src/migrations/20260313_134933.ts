import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "featured_image_id" integer`)
  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "news" ADD CONSTRAINT "news_featured_image_id_media_id_fk"
        FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "news_featured_image_idx" ON "news" USING btree ("featured_image_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "news" DROP CONSTRAINT IF EXISTS "news_featured_image_id_media_id_fk"`)
  await db.execute(sql`DROP INDEX IF EXISTS "news_featured_image_idx"`)
  await db.execute(sql`ALTER TABLE "news" DROP COLUMN IF EXISTS "featured_image_id"`)
}
