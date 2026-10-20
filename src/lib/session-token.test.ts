import { describe, expect, it } from 'vitest';
import { createHouseholdSessionToken, verifyHouseholdSessionToken } from './session-token';

describe('household session token', () => {
  const secret = 'test-secret-that-is-long-enough-for-hmac-signing';

  it('round-trips the household identifier and expiry', () => {
    const token = createHouseholdSessionToken('household_123', secret, new Date('2026-10-20T00:00:00.000Z'));

    expect(verifyHouseholdSessionToken(token, secret, new Date('2026-10-21T00:00:00.000Z'))).toEqual({
      householdId: 'household_123',
      expiresAt: '2027-10-20T00:00:00.000Z',
    });
  });

  it('rejects a token whose household identifier was modified', () => {
    const token = createHouseholdSessionToken('household_123', secret, new Date('2026-10-20T00:00:00.000Z'));
    const [payload, signature] = token.split('.');
    const decoded = Buffer.from(payload, 'base64url').toString('utf8').replace('household_123', 'household_999');
    const tampered = `${Buffer.from(decoded, 'utf8').toString('base64url')}.${signature}`;

    expect(verifyHouseholdSessionToken(tampered, secret, new Date('2026-10-21T00:00:00.000Z'))).toBeNull();
  });

  it('rejects an expired token', () => {
    const token = createHouseholdSessionToken('household_123', secret, new Date('2026-10-20T00:00:00.000Z'));

    expect(verifyHouseholdSessionToken(token, secret, new Date('2027-10-20T00:00:00.001Z'))).toBeNull();
  });
});
