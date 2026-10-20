import { describe, expect, it } from 'vitest';

import { toUserHealthProfile } from './profile-serialization';

const validRow = {
  id: 'a94c19cb-6dc4-4ae9-9bd6-c2dc8c861f02',
  name: 'คุณพ่อ',
  relationship: 'ผู้ดูแล',
  age: 68,
  tag: 'เฝ้าระวังโซเดียม',
  avatar_icon: null,
  health_condition: 'hypertension',
  daily_budget: { sodiumMg: 1500, sugarG: 20, saturatedFatG: 12, caloriesKcal: 1800 },
  daily_consumed: { sodiumMg: 1180, sugarG: 10, saturatedFatG: 5, caloriesKcal: 1420 },
};

describe('toUserHealthProfile', () => {
  it('converts the database naming convention to the client profile shape', () => {
    expect(toUserHealthProfile(validRow)).toMatchObject({
      id: validRow.id,
      avatarIcon: undefined,
      condition: 'hypertension',
      dailyBudget: validRow.daily_budget,
      dailyConsumed: validRow.daily_consumed,
    });
  });

  it('rejects malformed nutrition payloads rather than passing them to the client', () => {
    expect(() => toUserHealthProfile({ ...validRow, daily_budget: { sodiumMg: '1500' } })).toThrow();
  });
});
