import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import type { DB } from './types.generated';

export type { DB } from './types.generated';

export function createDb(connectionString = process.env.DATABASE_URL): Kysely<DB> {
  if (!connectionString) throw new Error('DATABASE_URL manquant');
  return new Kysely<DB>({
    dialect: new PostgresDialect({ pool: new pg.Pool({ connectionString, max: 5 }) }),
  });
}
