import { FoodAdditive } from '../types';

export const FOOD_ADDITIVES: Record<string, FoodAdditive> = {
  E621: {
    code: 'E621',
    nameTh: 'โมโนโซเดียมแอล-กลูทาเมต (ผงชูรส / MSG)',
    nameEn: 'Monosodium Glutamate',
    category: 'วัตถุปรุงแต่งรสอาหาร (Flavor Enhancer)',
    safetyStatus: 'caution',
    safetySummaryTh: 'มีโซเดียมแฝง 12% โดยน้ำหนัก แม้ไม่เค็มจัด แต่เพิ่มปริมาณโซเดียมในกระแสเลือด ผู้ป่วยความดันและโรคไตควรนับรวมในโควตารายวัน',
    fdaPermitted: true,
    maxLimitCodex: 'GMP (ตามความจำเป็นทางเทคโนโลยี)',
    sensitiveGroups: ['ผู้ป่วยโรคไตเรื้อรัง (CKD)', 'ผู้ป่วยความดันโลหิตสูง', 'ผู้มีอาการไชนิสเรสเตอรองต์ซินโดรม'],
  },
  E627: {
    code: 'E627 / E631',
    nameTh: 'ไดโซเดียม 5\'-ไรโบนิวคลีโอไทด์ (I+G)',
    nameEn: 'Disodium 5\'-Ribonucleotides',
    category: 'วัตถุปรุงแต่งรสอาหารรสอูมามิเสริมฤทธิ์',
    safetyStatus: 'caution',
    safetySummaryTh: 'ช่วยเพิ่มรสกลมกล่อมร่วมกับผงชูรสได้ 4-8 เท่า มักพบในบะหมี่และผงปรุงรส มีพิวรีนสูง ผู้ป่วยโรคเกาต์ (Gout) ควรระมัดระวัง',
    fdaPermitted: true,
    maxLimitCodex: 'GMP (อย. ประกาศกระทรวงสาธารณสุข ฉบับที่ 418)',
    sensitiveGroups: ['ผู้ป่วยโรคเกาต์ (กรดยูริกสูง)', 'ผู้ป่วยโรคไต'],
  },
  E452: {
    code: 'E452(i)',
    nameTh: 'โซเดียมพอลิฟอสเฟต (Sodium Polyphosphate)',
    nameEn: 'Sodium Polyphosphate',
    category: 'สารควบคุมความเป็นกรด & ปรับสภาพเส้นเหนียวนุ่ม (Emulsifying Salt)',
    safetyStatus: 'warning',
    safetySummaryTh: 'ฟอสเฟตอนินทรีย์ (Inorganic Phosphate) ร่างกายดูดซึมได้ 90-100% ไตที่เสื่อมสภาพไม่สามารถขับออกได้ ก่อให้เกิดหลอดเลือดแข็งตัวและกระดูกพรุน',
    fdaPermitted: true,
    maxLimitCodex: 'ไม่เกิน 2,200 มก./กก. (คำนวณเป็นฟอสฟอรัส)',
    sensitiveGroups: ['ผู้ป่วยโรคไตวายเรื้อรัง ระยะ 3-5 (ห้ามบริโภคเกินเกณฑ์)', 'ผู้ป่วยหลอดเลือดหัวใจ'],
  },
  E211: {
    code: 'E211',
    nameTh: 'โซเดียมเบนโซเอต (Sodium Benzoate)',
    nameEn: 'Sodium Benzoate',
    category: 'วัตถุกันเสีย ยับยั้งยีสต์และเชื้อรา (Preservative)',
    safetyStatus: 'caution',
    safetySummaryTh: 'ใช้ในน้ำเชื่อม ซอสปรุงรส และน้ำอัดลม มีโซเดียมแฝง และอาจกระตุ้นปฏิกิริยาแพ้ในผู้ป่วยหอบหืด หากผสมกับกรดแอสคอร์บิก (วิตามินซี) อาจเกิดเบนซีนได้',
    fdaPermitted: true,
    maxLimitCodex: 'ไม่เกิน 1,000 มก./กก. (อย. อนุญาต)',
    sensitiveGroups: ['ผู้ป่วยหอบหืด (Asthma)', 'ผู้มีประวัติผื่นลมพิษเรื้อรัง', 'เด็กเล็ก'],
  },
  E102: {
    code: 'E102',
    nameTh: 'ทาร์ทราซีน (Tartrazine / สีสังเคราะห์สีเหลืองเบอร์ 5)',
    nameEn: 'Tartrazine (FD&C Yellow No. 5)',
    category: 'สีสังเคราะห์ผสมอาหาร (Synthetic Food Color)',
    safetyStatus: 'warning',
    safetySummaryTh: 'สีผสมอาหารกลุ่ม Azo dye สหภาพยุโรป (EU) บังคับให้ติดคำเตือน "อาจส่งผลกระทบต่อสมาธิและกิจกรรมในเด็ก" อาจกระตุ้นภูมิแพ้ในผู้แพ้แอสไพริน',
    fdaPermitted: true,
    maxLimitCodex: 'ไม่เกิน 100 มก./กก. ในอาหารพร้อมบริโภค',
    sensitiveGroups: ['เด็กสมาธิสั้น (ADHD)', 'ผู้แพ้ยาแอสไพริน', 'ผู้ป่วยภูมิแพ้ทางเดินหายใจ'],
  },
  E950: {
    code: 'E950',
    nameTh: 'แอซีซัลเฟม โพแทสเซียม (Acesulfame K)',
    nameEn: 'Acesulfame Potassium',
    category: 'สารให้ความหวานแทนน้ำตาล (Non-nutritive Sweetener)',
    safetyStatus: 'safe',
    safetySummaryTh: 'ให้ความหวาน 200 เท่าของน้ำตาลทราย ไม่ให้พลังงาน ไม่กระตุ้นระดับน้ำตาลในเลือด เหมาะสำหรับผู้ป่วยเบาหวาน มีโพแทสเซียมเล็กน้อย',
    fdaPermitted: true,
    maxLimitCodex: 'ADI: 0 - 15 มก./กก. น้ำหนักตัว/วัน (JECFA)',
    sensitiveGroups: ['ผู้ป่วยโรคไตระยะล้างไตที่ต้องคุมโพแทสเซียมเข้มงวด'],
  },
  E955: {
    code: 'E955',
    nameTh: 'ซูคราโลส (Sucralose)',
    nameEn: 'Sucralose',
    category: 'สารให้ความหวานแทนน้ำตาล ปราศจากแคลอรี่',
    safetyStatus: 'safe',
    safetySummaryTh: 'ทนความร้อนสูง ไม่ทำให้อิ่มน้ำตาล ไม่ส่งผลกระทบต่อระดับอินซูลิน ได้รับการรับรองความปลอดภัยจาก US FDA และ อย. ไทย',
    fdaPermitted: true,
    maxLimitCodex: 'ADI: 0 - 15 มก./กก. น้ำหนักตัว/วัน',
    sensitiveGroups: [],
  },
  E330: {
    code: 'E330',
    nameTh: 'กรดซิตริก (Citric Acid)',
    nameEn: 'Citric Acid',
    category: 'สารควบคุมความเป็นกรด (Acidity Regulator)',
    safetyStatus: 'safe',
    safetySummaryTh: 'พบได้ตามธรรมชาติในผลไม้รสเปรี้ยว เช่น มะนาว ร่างกายเผาผลาญใน Krebs cycle ได้ ปลอดภัยสูง',
    fdaPermitted: true,
    maxLimitCodex: 'GMP (ใช้ได้ทั่วไปตามความเหมาะสม)',
    sensitiveGroups: ['ผู้มีแผลในกระเพาะอาหารขั้นรุนแรง (ระคายเคืองหากเข้มข้น)'],
  },
};

/**
 * Extract additive codes from product ingredients or return relevant additives based on category
 */
export function getProductAdditives(ingredients: string[], category: string): FoodAdditive[] {
  const result: FoodAdditive[] = [];
  const text = ingredients.join(' ').toLowerCase();

  if (text.includes('ชูรส') || text.includes('glutamate') || text.includes('msg')) {
    result.push(FOOD_ADDITIVES.E621);
  }
  if (text.includes('ไรโบนิวคลีโอไทด์') || text.includes('i+g') || text.includes('ribonucleotide')) {
    result.push(FOOD_ADDITIVES.E627);
  }
  if (text.includes('ฟอสเฟต') || text.includes('phosphate') || category === 'instant_noodles') {
    result.push(FOOD_ADDITIVES.E452);
  }
  if (text.includes('เบนโซเอต') || text.includes('benzoate') || text.includes('กันเสีย') || category === 'condiments') {
    result.push(FOOD_ADDITIVES.E211);
  }
  if (text.includes('สี') || text.includes('tartrazine') || text.includes('yellow')) {
    result.push(FOOD_ADDITIVES.E102);
  }
  if (text.includes('แอซีซัลเฟม') || text.includes('acesulfame')) {
    result.push(FOOD_ADDITIVES.E950);
  }
  if (text.includes('ซูคราโลส') || text.includes('sucralose')) {
    result.push(FOOD_ADDITIVES.E955);
  }
  if (text.includes('ซิตริก') || text.includes('citric') || text.includes('มะนาว')) {
    result.push(FOOD_ADDITIVES.E330);
  }

  // Ensure default fallback if list empty
  if (result.length === 0) {
    if (category === 'instant_noodles') {
      return [FOOD_ADDITIVES.E621, FOOD_ADDITIVES.E452];
    } else if (category === 'condiments') {
      return [FOOD_ADDITIVES.E621, FOOD_ADDITIVES.E211];
    } else if (category === 'beverages') {
      return [FOOD_ADDITIVES.E950, FOOD_ADDITIVES.E330];
    }
  }

  return result;
}
