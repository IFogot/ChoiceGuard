import { z } from 'zod';

import { UserHealthProfile } from '../types';

const nutritionTotalsSchema = z
  .object({
    sodiumMg: z.number().finite().nonnegative(),
    sugarG: z.number().finite().nonnegative(),
    saturatedFatG: z.number().finite().nonnegative(),
    caloriesKcal: z.number().finite().nonnegative(),
  })
  .strict();

const storedHealthProfileSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).max(80),
    relationship: z.string().max(80).nullable(),
    age: z.number().int().min(0).max(130).nullable(),
    tag: z.string().max(160).nullable(),
    avatar_icon: z.string().max(32).nullable(),
    health_condition: z.enum(['hypertension', 'diabetes', 'dyslipidemia', 'elderly', 'general']),
    daily_budget: nutritionTotalsSchema,
    daily_consumed: nutritionTotalsSchema,
  })
  .strict();

/** Converts a validated Neon profile row to the client-facing health profile. */
export function toUserHealthProfile(value: unknown): UserHealthProfile {
  const profile = storedHealthProfileSchema.parse(value);

  return {
    id: profile.id,
    name: profile.name,
    relationship: profile.relationship ?? undefined,
    age: profile.age ?? undefined,
    tag: profile.tag ?? undefined,
    avatarIcon: profile.avatar_icon ?? undefined,
    condition: profile.health_condition,
    dailyBudget: profile.daily_budget,
    dailyConsumed: profile.daily_consumed,
  };
}
