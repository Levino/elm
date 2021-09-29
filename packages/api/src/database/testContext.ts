import mysql, { Connection, createConnection } from "mysql2/promise";
import randomstring from "randomstring";

import { createMigration, Migration } from "./migration";

export interface Context {
  mysql: Connection;
  migration: Migration;
  databaseName: string;
}

/**
 *  This is a hack to run all migrations at once.
 */
const MIGRATION_COUNT = 50;

export const getTestDatabaseHostname = (): string => "test-db";

interface Config {
  user: string;
  password: string;
  host: string;
}

export const createDatabase =
  (config: Config) =>
  async (databaseName: string): Promise<void> => {
    const connection = await mysql.createConnection({
      ...config,
    });
    await connection.query("CREATE DATABASE ??", databaseName);
    await connection.query(
      "GRANT ALL PRIVILEGES ON ?? . * TO `user`@`%`",
      databaseName
    );
    await connection.end();
  };

export const createDatabaseAsRoot = createDatabase({
  user: "root",
  password: "root",
  host: getTestDatabaseHostname(),
});

export const deleteDatabase =
  (config: Config) =>
  async (databaseName: string): Promise<void> => {
    const connection = await mysql.createConnection({
      ...config,
    });
    await connection.query("DROP DATABASE IF EXISTS ??", databaseName);
    await connection.end();
  };

export const deleteDatabaseAsRoot = deleteDatabase({
  user: "root",
  password: "root",
  host: getTestDatabaseHostname(),
});

export const setup = async (count = MIGRATION_COUNT): Promise<Context> => {
  const databaseName = randomstring.generate({
    length: 10,
    charset: "alphabetic",
  });

  await createDatabaseAsRoot(databaseName);

  const config = {
    user: "user",
    password: "password",
    database: databaseName,
    multipleStatements: true,
    host: getTestDatabaseHostname(),
  };

  const mysql = await createConnection(config);

  const migration = createMigration({
    config: { test: { ...config, driver: "mysql" } },
    env: "test",
  });

  await migration.up(count);

  return {
    migration,
    mysql,
    databaseName,
  };
};

export const teardown = async ({
  mysql,
  databaseName,
}: Context): Promise<void> => {
  await deleteDatabaseAsRoot(databaseName);
  await mysql.end();
};
