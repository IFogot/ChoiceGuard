import 'server-only';

import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl } from './database-config';

let client: ReturnType<typeof neon> | null = null;

/** Gets the singleton Neon HTTP client; routes must handle an unconfigured database explicitly. */
export function getDatabaseClient() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  client ??= neon(databaseUrl);
  return client;
}

export function isDatabaseConfigured(): boolean {
  return getDatabaseUrl() !== null;
}
