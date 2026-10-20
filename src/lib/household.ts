import 'server-only';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

import { getDatabaseClient } from './db';
import { getHouseholdSessionSecret } from './household-config';
import { createHouseholdSessionToken, verifyHouseholdSessionToken } from './session-token';

const HOUSEHOLD_COOKIE_NAME = 'choiceguard_household';
const HOUSEHOLD_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/** Creates or restores the anonymous household that owns the current browser's data. */
export async function getOrCreateHousehold(): Promise<{ id: string }> {
  const cookieStore = await cookies();
  const secret = getHouseholdSessionSecret();
  const signedToken = cookieStore.get(HOUSEHOLD_COOKIE_NAME)?.value;
  const verified = signedToken ? verifyHouseholdSessionToken(signedToken, secret) : null;
  const householdId = verified && isUuid(verified.householdId) ? verified.householdId : randomUUID();
  const mustSetCookie = householdId !== verified?.householdId;
  const sql = getDatabaseClient();

  await sql.query('INSERT INTO households (id) VALUES ($1) ON CONFLICT (id) DO NOTHING', [householdId]);

  if (mustSetCookie) {
    cookieStore.set(HOUSEHOLD_COOKIE_NAME, createHouseholdSessionToken(householdId, secret), {
      httpOnly: true,
      maxAge: HOUSEHOLD_COOKIE_MAX_AGE_SECONDS,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return { id: householdId };
}
