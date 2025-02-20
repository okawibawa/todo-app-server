import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("todos")
    .addColumn("rank", "int2", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable("todos").dropColumn("rank").execute();
}
