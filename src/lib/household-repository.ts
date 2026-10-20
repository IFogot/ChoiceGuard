import 'server-only';

import { getDatabaseClient } from './db';
import { createSeedProfiles } from './profile-seed';
import { toUserHealthProfile } from './profile-serialization';
import { UserHealthProfile } from '../types';

export async function seedHouseholdProfiles(householdId: string): Promise<void> {
  const sql = getDatabaseClient();
  const profiles = createSeedProfiles();

  await sql.transaction((transaction) =>
    profiles.map((profile) =>
      transaction.query(
        `INSERT INTO health_profiles (
          id, household_id, source_key, name, relationship, age, tag, avatar_icon,
          health_condition, daily_budget, daily_consumed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb)
        ON CONFLICT (household_id, source_key) DO NOTHING`,
        [
          profile.id,
          householdId,
          profile.sourceKey,
          profile.name,
          profile.relationship ?? null,
          profile.age ?? null,
          profile.tag ?? null,
          profile.avatarIcon ?? null,
          profile.condition,
          JSON.stringify(profile.dailyBudget),
          JSON.stringify(profile.dailyConsumed),
        ]
      )
    )
  );
}

export async function listHouseholdProfiles(householdId: string): Promise<UserHealthProfile[]> {
  const sql = getDatabaseClient();
  const rows = (await sql.query(
    `SELECT id, name, relationship, age, tag, avatar_icon, health_condition, daily_budget, daily_consumed
     FROM health_profiles
     WHERE household_id = $1
     ORDER BY created_at ASC`,
    [householdId]
  )) as unknown[];

  return rows.map(toUserHealthProfile);
}
