import { randomUUID } from 'node:crypto';

import { FAMILY_PROFILES } from '../data/familyProfiles';
import { UserHealthProfile } from '../types';

export type SeedProfile = UserHealthProfile & {
  sourceKey: string;
};

export function createSeedProfiles(createId: () => string = randomUUID): SeedProfile[] {
  return FAMILY_PROFILES.map((profile) => ({
    ...profile,
    id: createId(),
    sourceKey: profile.id,
    dailyBudget: { ...profile.dailyBudget },
    dailyConsumed: { ...profile.dailyConsumed },
  }));
}
