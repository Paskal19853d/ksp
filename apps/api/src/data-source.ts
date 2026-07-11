import "reflect-metadata";
import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "db",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "treetex",
  password: process.env.DB_PASSWORD ?? "treetex",
  database: process.env.DB_NAME ?? "treetex",
  entities: [`${__dirname}/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  synchronize: false,
});
