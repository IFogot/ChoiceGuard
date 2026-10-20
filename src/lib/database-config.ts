type Environment = Record<string, string | undefined>;

/** Returns a server-side PostgreSQL URL only when it has a safe protocol. */
export function getDatabaseUrl(environment: Environment = process.env): string | null {
  const value = environment.DATABASE_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'postgresql:' || url.protocol === 'postgres:' ? value : null;
  } catch {
    return null;
  }
}
