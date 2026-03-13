import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Enum nur anlegen, falls noch nicht vorhanden (z. B. nach fehlgeschlagenem Lauf)
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_fighters_status" AS ENUM('active', 'inactive');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `))
  await db.execute(sql`
    ALTER TABLE "fighters" ADD COLUMN IF NOT EXISTS "status" "enum_fighters_status" DEFAULT 'active';
    ALTER TABLE "fighters" ADD COLUMN IF NOT EXISTS "stats_leg_reach" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fighters" DROP COLUMN "status";
  ALTER TABLE "fighters" DROP COLUMN "stats_leg_reach";
  DROP TYPE "public"."enum_fighters_status";`)
}
