import { FoodProduct, UserHealthProfile } from '../types';

export interface ScoreBreakdown {
  finalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  color: string;
  summaryThai: string;
  penalties: {
    nutrient: string;
    points: number;
    reason: string;
  }[];
  bonuses: {
    feature: string;
    points: number;
    reason: string;
  }[];
  budgetImpact: {
    sodiumPercentOfDaily: number;
    sugarPercentOfDaily: number;
    saturatedFatPercentOfDaily: number;
  };
}

export function calculateChoiceScore(
  product: FoodProduct,
  profile: UserHealthProfile
): ScoreBreakdown {
  let score = 80; // Baseline starting score
  const penalties: ScoreBreakdown['penalties'] = [];
  const bonuses: ScoreBreakdown['bonuses'] = [];

  const { nutrition, healthierChoiceCertified } = product;
  const { dailyBudget } = profile;

  // 1. Budget percentages
  const sodiumPercent = Math.round((nutrition.sodiumMg / dailyBudget.sodiumMg) * 100);
  const sugarPercent = Math.round((nutrition.sugarG / dailyBudget.sugarG) * 100);
  const satFatPercent = Math.round((nutrition.saturatedFatG / dailyBudget.saturatedFatG) * 100);

  // 2. Healthier Choice Certification Bonus
  if (healthierChoiceCertified) {
    score += 20;
    bonuses.push({
      feature: 'ตราทางเลือกสุขภาพ (อย.)',
      points: 20,
      reason: 'ผ่านเกณฑ์ลด หวาน-มัน-เค็ม และได้รับการรับรองจาก อย. อย่างเป็นทางการ',
    });
  }

  // 3. Condition-specific evaluation
  switch (profile.condition) {
    case 'hypertension': { // ความดันโลหิตสูง (Strict Sodium)
      if (sodiumPercent > 60) {
        const penalty = Math.min(45, Math.round((sodiumPercent - 60) * 0.9) + 20);
        score -= penalty;
        penalties.push({
          nutrient: 'โซเดียมสูงวิกฤต',
          points: penalty,
          reason: `โซเดียม ${nutrition.sodiumMg} มก. คิดเป็น ${sodiumPercent}% ของงบผู้มีความดันโลหิตสูง`,
        });
      } else if (sodiumPercent > 35) {
        const penalty = 15;
        score -= penalty;
        penalties.push({
          nutrient: 'โซเดียมปานกลาง-สูง',
          points: penalty,
          reason: `โซเดียม ${nutrition.sodiumMg} มก. สูงเกิน 1 ใน 3 ของงบทั้งวันในมื้อเดียว`,
        });
      }

      if (nutrition.potassiumMg && nutrition.potassiumMg > 250) {
        bonuses.push({
          feature: 'มีโพแทสเซียมช่วยคุมความดัน',
          points: 5,
          reason: `โพแทสเซียม ${nutrition.potassiumMg} มก. มีส่วนช่วยสร้างสมดุลโซเดียม`,
        });
        score += 5;
      }
      break;
    }

    case 'diabetes': { // เบาหวาน (Strict Sugar)
      if (sugarPercent > 50) {
        const penalty = Math.min(50, Math.round((sugarPercent - 50) * 1.2) + 25);
        score -= penalty;
        penalties.push({
          nutrient: 'น้ำตาลสูงเสี่ยงต่อน้ำตาลในเลือด',
          points: penalty,
          reason: `น้ำตาล ${nutrition.sugarG} กรัม คิดเป็น ${sugarPercent}% ของงบผู้มีภาวะเบาหวาน`,
        });
      } else if (sugarPercent > 25) {
        const penalty = 15;
        score -= penalty;
        penalties.push({
          nutrient: 'น้ำตาลปานกลาง',
          points: penalty,
          reason: `น้ำตาล ${nutrition.sugarG} กรัม ควรระมัดระวังการดื่ม/บริโภคเพิ่มเติม`,
        });
      }

      if (nutrition.dietaryFiberG >= 4) {
        score += 8;
        bonuses.push({
          feature: 'ใยอาหารสูงช่วยชะลอการดูดซึมน้ำตาล',
          points: 8,
          reason: `ใยอาหาร ${nutrition.dietaryFiberG} กรัม ช่วยรักษาระดับไกลซีมิก`,
        });
      }
      break;
    }

    case 'dyslipidemia': { // ไขมันในเลือดสูง / หัวใจ
      if (satFatPercent > 45) {
        const penalty = Math.min(40, Math.round((satFatPercent - 45) * 1.0) + 20);
        score -= penalty;
        penalties.push({
          nutrient: 'ไขมันอิ่มตัวสูง',
          points: penalty,
          reason: `ไขมันอิ่มตัว ${nutrition.saturatedFatG} กรัม คิดเป็น ${satFatPercent}% ของงบสุขภาพหลอดเลือด`,
        });
      }
      break;
    }

    case 'elderly': { // ผู้สูงอายุ / ผู้ดูแล
      if (sodiumPercent > 45) {
        score -= 20;
        penalties.push({
          nutrient: 'โซเดียมสูงสำหรับผู้สูงวัย',
          points: 20,
          reason: `ไตของผู้สูงอายุขับโซเดียมได้ช้าลง เสี่ยงไตเสื่อมและบวมน้ำ`,
        });
      }
      if (sugarPercent > 40) {
        score -= 15;
        penalties.push({
          nutrient: 'น้ำตาลค่อนข้างสูง',
          points: 15,
          reason: `เพิ่มความเสี่ยงดื้ออินซูลินในผู้สูงวัย`,
        });
      }
      if (nutrition.proteinG >= 15) {
        score += 10;
        bonuses.push({
          feature: 'โปรตีนคุณภาพสูง',
          points: 10,
          reason: `โปรตีน ${nutrition.proteinG} กรัม ช่วยป้องกันภาวะกล้ามเนื้อสลาย (Sarcopenia)`,
        });
      }
      break;
    }

    default: { // ทั่วไป (General Adult)
      if (sodiumPercent > 50) {
        score -= 25;
        penalties.push({
          nutrient: 'โซเดียมสูง',
          points: 25,
          reason: `คิดเป็น ${sodiumPercent}% ของคำแนะนำ WHO (2,000 มก./วัน)`,
        });
      }
      if (sugarPercent > 50) {
        score -= 20;
        penalties.push({
          nutrient: 'น้ำตาลสูง',
          points: 20,
          reason: `คิดเป็น ${sugarPercent}% ของคำแนะนำ WHO (24 กรัม/วัน)`,
        });
      }
      if (satFatPercent > 50) {
        score -= 15;
        penalties.push({
          nutrient: 'ไขมันอิ่มตัวสูง',
          points: 15,
          reason: `เกิน 50% ของงบไขมันอิ่มตัวต่อวัน`,
        });
      }
      break;
    }
  }

  // Bound score between 5 and 100
  const finalScore = Math.max(5, Math.min(100, score));

  // Determine Grade & Visual Theme
  let grade: ScoreBreakdown['grade'] = 'C';
  let color = '#f59e0b'; // Amber
  let summaryThai = 'บริโภคได้เป็นครั้งคราว ควรระวังสารอาหารบางชนิด';

  if (finalScore >= 85) {
    grade = 'A';
    color = '#10b981'; // Emerald Green
    summaryThai = 'เหมาะอย่างยิ่งกับเป้าหมายสุขภาพของคุณ ผ่านเกณฑ์โภชนาการดีเยี่ยม';
  } else if (finalScore >= 70) {
    grade = 'B';
    color = '#06b6d4'; // Cyan
    summaryThai = 'เหมาะสมกับสุขภาพในเกณฑ์ดี สารอาหารสมดุล';
  } else if (finalScore >= 50) {
    grade = 'C';
    color = '#f59e0b'; // Amber
    summaryThai = 'ควรจำกัดปริมาณ หรือสลับกับอาหารสูตรลดเกลือ/น้ำตาล';
  } else if (finalScore >= 35) {
    grade = 'D';
    color = '#f97316'; // Orange
    summaryThai = 'สารอาหารขัดกับเป้าหมายสุขภาพอย่างมีนัยสำคัญ แนะนำให้ใช้ Smart Swap';
  } else {
    grade = 'F';
    color = '#ef4444'; // Red
    summaryThai = 'ไม่แนะนำสำหรับภาวะสุขภาพของคุณ เสี่ยงรับโซเดียม/น้ำตาลเกินพิกัด';
  }

  return {
    finalScore,
    grade,
    color,
    summaryThai,
    penalties,
    bonuses,
    budgetImpact: {
      sodiumPercentOfDaily: sodiumPercent,
      sugarPercentOfDaily: sugarPercent,
      saturatedFatPercentOfDaily: satFatPercent,
    },
  };
}
