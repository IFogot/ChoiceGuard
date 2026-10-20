import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_DURATION_MS = 365 * 24 * 60 * 60 * 1000;

interface SessionPayload {
  householdId: string;
  expiresAt: string;
}

function encode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decode(value: string): string | null {
  try {
    return Buffer.from(value, 'base64url').toString('utf8');
  } catch {
    return null;
  }
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function expiresOneYearAfter(now: Date): Date {
  const expiresAt = new Date(now);
  expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);
  return expiresAt;
}

/** Creates an opaque, signed token for a guest household. */
export function createHouseholdSessionToken(householdId: string, secret: string, now = new Date()): string {
  const payload = encode(JSON.stringify({ householdId, expiresAt: expiresOneYearAfter(now).toISOString() }));
  return `${payload}.${sign(payload, secret)}`;
}

/** Returns the signed household claims only when the token is intact and unexpired. */
export function verifyHouseholdSessionToken(token: string, secret: string, now = new Date()): SessionPayload | null {
  const [payload, signature, ...rest] = token.split('.');
  if (!payload || !signature || rest.length > 0) return null;

  const expectedSignature = sign(payload, secret);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  const decoded = decode(payload);
  if (!decoded) return null;

  try {
    const data = JSON.parse(decoded) as SessionPayload;
    const expiresAt = new Date(data.expiresAt);
    if (!data.householdId || Number.isNaN(expiresAt.getTime()) || expiresAt <= now) return null;
    return { householdId: data.householdId, expiresAt: expiresAt.toISOString() };
  } catch {
    return null;
  }
}
