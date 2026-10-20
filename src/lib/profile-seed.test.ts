import { describe, expect, it } from 'vitest';
import { createSeedProfiles } from './profile-seed';

describe('initial household profiles', () => {
  it('creates a distinct persisted identifier for every starter profile', () => {
    let sequence = 0;
    const profiles = createSeedProfiles(() => `generated-id-${++sequence}`);

    expect(profiles).toHaveLength(3);
    expect(profiles.map((profile) => profile.id)).toEqual(['generated-id-1', 'generated-id-2', 'generated-id-3']);
    expect(profiles.map((profile) => profile.sourceKey)).toEqual([
      'profile_dad',
      'profile_mom',
      'profile_child',
    ]);
  });

  it('copies health budgets rather than sharing mutable seed objects', () => {
    const [profile] = createSeedProfiles(() => 'generated-id');
    profile.dailyBudget.sodiumMg = 1;

    expect(createSeedProfiles(() => 'another-id')[0].dailyBudget.sodiumMg).not.toBe(1);
  });
});
