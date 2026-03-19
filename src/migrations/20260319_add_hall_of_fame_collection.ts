import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Idempotent: Tabellen/Spalten/Constraints können bereits durch Payload Dev-Push existieren
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "hall_of_fame" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "image_id" integer,
      "active_years" varchar NOT NULL,
      "bio" varchar,
      "legacy" varchar,
      "sort_order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    )
  `)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "hall_of_fame_achievements" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL
    )
  `)
  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "hall_of_fame_achievements" ADD CONSTRAINT "hall_of_fame_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hall_of_fame"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))
  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "hall_of_fame" ADD CONSTRAINT "hall_of_fame_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "hall_of_fame_slug_idx" ON "hall_of_fame" USING btree ("slug")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "hall_of_fame_image_id_idx" ON "hall_of_fame" USING btree ("image_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "hall_of_fame_sort_order_idx" ON "hall_of_fame" USING btree ("sort_order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "hall_of_fame_achievements_order_idx" ON "hall_of_fame_achievements" USING btree ("_order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "hall_of_fame_achievements_parent_id_idx" ON "hall_of_fame_achievements" USING btree ("_parent_id")`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "hall_of_fame_id" integer`)
  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hall_of_fame_fk" FOREIGN KEY ("hall_of_fame_id") REFERENCES "public"."hall_of_fame"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_hall_of_fame_id_idx" ON "payload_locked_documents_rels" USING btree ("hall_of_fame_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_hall_of_fame_fk"`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_hall_of_fame_id_idx"`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "hall_of_fame_id"`)
  await db.execute(sql`DROP TABLE IF EXISTS "hall_of_fame_achievements" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "hall_of_fame" CASCADE`)
}
