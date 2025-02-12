import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import Database from "./schema/Database";

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DATABASE_HOST,
      password: process.env.DATABASE_PASSWORD,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE_NAME,
      port: +(process.env.DATABASE_PORT as string),
    }),
  }),
});
