import { UserHealthProfile } from '../types';

export interface BiomarkerForecast {
  systolicSpikeMmHg: number;
  diastolicSpikeMmHg: number;
  extracellularFluidMl: number;
  peakHours: number;
  clearanceHours: number;
  waterFlushRecommendedMl: number;
  riskTier: 'safe' | 'low' | 'moderate' | 'high' | 'critical';
  adviceTh: string;
  renalLoadPercent: number;
}

export function calculateBiomarkerForecast(
  mealSodiumMg: number,
  profile: UserHealthProfile,
  brothPercent: number = 100
): BiomarkerForecast {
  // Broth adjustment: noodles/soups have ~60% sodium in the broth
  const adjustedSodium = Math.round(
    mealSodiumMg * (0.4 + 0.6 * (brothPercent / 100))
  );

  const isHypertensive = profile.condition === 'hypertension';
  const isElderly = profile.condition === 'elderly';
  const isKidneyRisk = profile.condition === 'hypertension' || profile.condition === 'elderly';

  // Salt sensitivity multiplier (Hypertensive & Senior are significantly more salt-sensitive)
  const sensitivityMultiplier = isHypertensive ? 1.35 : isElderly ? 1.2 : 0.85;

  // Systolic Spike: each 400mg sodium in single meal drives ~1.2 - 1.8 mmHg transient elevation
  const systolicSpike = +(
    Math.min(15, (adjustedSodium / 350) * sensitivityMultiplier)
  ).toFixed(1);

  // Diastolic Spike
  const diastolicSpike = +(
    Math.min(9, (adjustedSodium / 550) * sensitivityMultiplier)
  ).toFixed(1);

  // Water retention: 400mg sodium (1g salt) pulls ~95-100 mL extracellular fluid
  const extracellularFluidMl = Math.round((adjustedSodium / 400) * 95);

  // Clearance hours: healthy kidneys clear in ~12 hrs, elderly/hypertensive take 18-24 hrs
  const clearanceHours = Math.round(
    Math.min(36, 8 + (adjustedSodium / 120) * (isKidneyRisk ? 1.4 : 1.0))
  );

  // Water flush to assist renal natriuresis without volume overload
  const waterFlushRecommendedMl = Math.min(800, Math.max(250, Math.round(extracellularFluidMl * 1.15)));

  // Risk Tier calculation
  const budgetRatio = adjustedSodium / profile.dailyBudget.sodiumMg;
  let riskTier: BiomarkerForecast['riskTier'] = 'safe';
  let adviceTh = 'ระดับโซเดียมอยู่ในเกณฑ์ปลอดภัย ร่างกายสามารถขับออกได้ตามปกติ';

  if (budgetRatio > 0.8) {
    riskTier = 'critical';
    adviceTh = `⚠️ มื้อเดียวเกิน 80% ของงบทั้งวัน! เสี่ยงความดันพุ่งเฉียบพลัน ${systolicSpike} mmHg แนะนำงดซดน้ำซุป และดื่มน้ำเปล่าเพิ่ม ${waterFlushRecommendedMl} มล. เพื่อช่วยขับโซเดียม`;
  } else if (budgetRatio > 0.55) {
    riskTier = 'high';
    adviceTh = `มื้อนี้มีโซเดียมค่อนข้างสูง ร่างกายจะกักเก็บน้ำเพิ่ม ${extracellularFluidMl} มล. แนะนำหลีกเลี่ยงของเค็มในมื้อถัดไป`;
  } else if (budgetRatio > 0.35) {
    riskTier = 'moderate';
    adviceTh = 'ระดับโซเดียมปานกลาง หากซดน้ำซุปไม่หมด จะช่วยลดภาระไตได้อีกกว่า 40%';
  } else {
    riskTier = 'safe';
    adviceTh = 'ดีเยี่ยม! ปริมาณโซเดียมเป็นมิตรต่อหลอดเลือดหัวใจและไต ไม่ก่อให้เกิดภาวะคั่งน้ำ';
  }

  const renalLoadPercent = Math.min(100, Math.round(budgetRatio * 100));

  return {
    systolicSpikeMmHg: systolicSpike,
    diastolicSpikeMmHg: diastolicSpike,
    extracellularFluidMl,
    peakHours: 2.5,
    clearanceHours,
    waterFlushRecommendedMl,
    riskTier,
    adviceTh,
    renalLoadPercent,
  };
}
