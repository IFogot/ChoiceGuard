import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl?.startsWith('postgres')) {
  throw new Error('DATABASE_URL must be configured before running migrations.');
}

const sql = neon(databaseUrl);
const migrationsDirectory = join(process.cwd(), 'db', 'migrations');
const migrationFiles = (await readdir(migrationsDirectory)).filter((file) => file.endsWith('.sql')).sort();

await sql.query('CREATE TABLE IF NOT EXISTS schema_migrations (migration_id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');

for (const migrationFile of migrationFiles) {
  const alreadyApplied = await sql.query('SELECT migration_id FROM schema_migrations WHERE migration_id = $1', [migrationFile]);
  if (alreadyApplied.length > 0) continue;

  const migration = await readFile(join(migrationsDirectory, migrationFile), 'utf8');
  const statements = migration.split(/;\s*(?:\r?\n|$)/).map((statement) => statement.trim()).filter(Boolean);
  await sql.transaction((transaction) => [
    ...statements.map((statement) => transaction.query(statement)),
    transaction.query('INSERT INTO schema_migrations (migration_id) VALUES ($1)', [migrationFile]),
  ]);
  console.log(`Applied ${migrationFile}`);
}
