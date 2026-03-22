import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── users_rels: Favoriten-Junction-Tabelle ──────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "fighters_id" integer
    )
  `)

  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "users_rels"
        ADD CONSTRAINT "users_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "users_rels"
        ADD CONSTRAINT "users_rels_fighters_fk"
        FOREIGN KEY ("fighters_id") REFERENCES "public"."fighters"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" USING btree ("order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" USING btree ("path")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "users_rels_fighters_id_idx" ON "users_rels" USING btree ("fighters_id")`)

  // ── news_rels: Tagged-Fighters-Junction-Tabelle ─────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "news_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "fighters_id" integer
    )
  `)

  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "news_rels"
        ADD CONSTRAINT "news_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      ALTER TABLE "news_rels"
        ADD CONSTRAINT "news_rels_fighters_fk"
        FOREIGN KEY ("fighters_id") REFERENCES "public"."fighters"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `))

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "news_rels_order_idx" ON "news_rels" USING btree ("order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "news_rels_path_idx" ON "news_rels" USING btree ("path")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "news_rels_fighters_id_idx" ON "news_rels" USING btree ("fighters_id")`)

  // payload_locked_documents_rels: Neue Rels-Typen registrieren (falls nötig)
  // Payload verwaltet dies selbst über die Rels-Tabellen
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "news_rels" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "users_rels" CASCADE`)
}
