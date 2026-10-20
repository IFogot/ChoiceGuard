import { describe, expect, it } from 'vitest';
import { getDatabaseUrl } from './database-config';

describe('database configuration', () => {
  it('returns null when DATABASE_URL is absent', () => {
    expect(getDatabaseUrl({})).toBeNull();
  });

  it('returns a PostgreSQL URL without exposing it elsewhere', () => {
    expect(getDatabaseUrl({ DATABASE_URL: 'postgresql://user:password@host.example/db?sslmode=require' }))
      .toBe('postgresql://user:password@host.example/db?sslmode=require');
  });

  it('rejects a non-PostgreSQL value', () => {
    expect(getDatabaseUrl({ DATABASE_URL: 'https://not-a-database.example' })).toBeNull();
  });
});
