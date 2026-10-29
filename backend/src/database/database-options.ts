import type { DataSourceOptions } from "typeorm";

export const databaseOptions = {
  type: "better-sqlite3",
  database: process.env.DATABASE_PATH ?? "db.sqlite",
  entities: [import.meta.dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true,
} satisfies DataSourceOptions;
