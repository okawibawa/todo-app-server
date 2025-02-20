import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("rank_minmax")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("min", "smallint", (col) => col.notNull())
    .addColumn("max", "smallint", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("rank_minmax").execute();
}
