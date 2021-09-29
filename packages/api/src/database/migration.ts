import * as DBMigrate from "db-migrate";

export interface Migration {
  up: (count: number) => Promise<void>;
  down: (count: number) => Promise<void>;
  reset: () => Promise<void>;
}

export function createMigration(options: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  config: any;
  env: string;
}): Migration {
  const migrationInstance = DBMigrate.getInstance(true, options);
  migrationInstance.silence(true);
  return {
    up: async (count) => migrationInstance.up(count),
    down: async (count) => migrationInstance.down(count),
    reset: async () => migrationInstance.reset(),
  };
}
