import { UserHealthProfile } from '../types';

export const FAMILY_PROFILES: UserHealthProfile[] = [
  {
    id: 'profile_dad',
    name: 'คุณพ่อ (สมชาย)',
    relationship: 'คุณพ่อ (Elderly Caregiver)',
    age: 68,
    tag: 'ผู้สูงอายุ & ความดันโลหิตสูง + เฝ้าระวังไตเสื่อม',
    condition: 'hypertension',
    dailyBudget: {
      sodiumMg: 1500, // Strict WHO/AHA guideline for hypertension
      sugarG: 20,
      saturatedFatG: 12,
      caloriesKcal: 1800,
    },
    dailyConsumed: {
      sodiumMg: 1180, // Currently at ~79% of budget
      sugarG: 10,
      saturatedFatG: 5,
      caloriesKcal: 1420,
    },
  },
  {
    id: 'profile_mom',
    name: 'คุณแม่ (มาลี)',
    relationship: 'คุณแม่',
    age: 64,
    tag: 'เบาหวานชนิดที่ 2 & ไขมันในเลือดสูง (Strict Sugar)',
    condition: 'diabetes',
    dailyBudget: {
      sodiumMg: 2000,
      sugarG: 16, // Strict low sugar
      saturatedFatG: 10, // Strict low saturated fat
      caloriesKcal: 1600,
    },
    dailyConsumed: {
      sodiumMg: 920, // 46%
      sugarG: 14,    // 88% close to limit!
      saturatedFatG: 8, // 80%
      caloriesKcal: 1280,
    },
  },
  {
    id: 'profile_child',
    name: 'ลูก (กวิน)',
    relationship: 'ตัวฉันเอง (คนทำงาน)',
    age: 32,
    tag: 'คนวัยทำงาน & บริโภคอาหารสำเร็จรูปเป็นประจำ',
    condition: 'general',
    dailyBudget: {
      sodiumMg: 2000, // Standard WHO
      sugarG: 24,
      saturatedFatG: 15,
      caloriesKcal: 2000,
    },
    dailyConsumed: {
      sodiumMg: 1650, // 82% from instant noodles/lunch!
      sugarG: 18,
      saturatedFatG: 11,
      caloriesKcal: 1750,
    },
  },
];
