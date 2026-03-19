import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    ALTER TYPE "public"."enum_users_role" ADD VALUE IF NOT EXISTS 'fan';
  `))
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" varchar;
  `)
  await db.execute(sql.raw(`
    UPDATE "users" SET "username" = 'user-' || "id"::text
    WHERE "username" IS NULL;
  `))
  await db.execute(sql`
    ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
  `)
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "users_username_idx" ON "users" USING btree ("username");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "users_username_idx";
  `)
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "username";
  `)
  // Hinweis: PostgreSQL unterstützt kein DROP VALUE für Enums – 'fan' bleibt im enum_users_role.
}
