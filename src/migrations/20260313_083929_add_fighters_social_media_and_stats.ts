import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fighters" ADD COLUMN "social_media_instagram" varchar;
  ALTER TABLE "fighters" ADD COLUMN "social_media_twitter" varchar;
  ALTER TABLE "fighters" ADD COLUMN "social_media_youtube" varchar;
  ALTER TABLE "fighters" ADD COLUMN "stats_height" varchar;
  ALTER TABLE "fighters" ADD COLUMN "stats_reach" varchar;
  ALTER TABLE "fighters" ADD COLUMN "stats_fighting_style" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fighters" DROP COLUMN "social_media_instagram";
  ALTER TABLE "fighters" DROP COLUMN "social_media_twitter";
  ALTER TABLE "fighters" DROP COLUMN "social_media_youtube";
  ALTER TABLE "fighters" DROP COLUMN "stats_height";
  ALTER TABLE "fighters" DROP COLUMN "stats_reach";
  ALTER TABLE "fighters" DROP COLUMN "stats_fighting_style";`)
}
