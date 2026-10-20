import { NextResponse } from 'next/server';

import { getOrCreateHousehold } from '@/lib/household';
import { listHouseholdProfiles, seedHouseholdProfiles } from '@/lib/household-repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const household = await getOrCreateHousehold();
    await seedHouseholdProfiles(household.id);
    const profiles = await listHouseholdProfiles(household.id);

    return NextResponse.json(
      { profiles, persistence: 'database' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN_PERSISTENCE_ERROR';
    const status = code === 'DATABASE_NOT_CONFIGURED' || code === 'HOUSEHOLD_SESSION_NOT_CONFIGURED' ? 503 : 500;

    console.error('Household bootstrap failed:', code);
    return NextResponse.json(
      {
        error: status === 503 ? 'PERSISTENCE_UNAVAILABLE' : 'PERSISTENCE_FAILED',
        message:
          status === 503
            ? 'Household persistence is not configured yet.'
            : 'Household persistence could not be initialized.',
      },
      { status, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
