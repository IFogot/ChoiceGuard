import { describe, expect, it } from 'vitest';

import { getHouseholdSessionSecret } from './household-config';

describe('getHouseholdSessionSecret', () => {
  it('rejects a missing household-session secret', () => {
    expect(() => getHouseholdSessionSecret({})).toThrow('HOUSEHOLD_SESSION_NOT_CONFIGURED');
  });

  it('rejects a short household-session secret', () => {
    expect(() => getHouseholdSessionSecret({ HOUSEHOLD_SESSION_SECRET: 'too-short' })).toThrow(
      'HOUSEHOLD_SESSION_NOT_CONFIGURED'
    );
  });

  it('returns a sufficiently long secret after trimming surrounding whitespace', () => {
    const secret = 'a'.repeat(32);

    expect(getHouseholdSessionSecret({ HOUSEHOLD_SESSION_SECRET: ` ${secret} ` })).toBe(secret);
  });
});
