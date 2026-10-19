export type HealthCondition = 
  | 'hypertension'     // ความดันโลหิตสูง (Strict Sodium)
  | 'diabetes'         // เบาหวาน (Strict Sugar & Carbs)
  | 'dyslipidemia'     // ไขมันในเลือดสูง / หลอดเลือดหัวใจ (Strict Saturated Fat)
  | 'elderly'          // ผู้สูงอายุ / ผู้ดูแล (Balanced & Digestible)
  | 'general';         // ทั่วไป / วัยทำงาน

export interface UserHealthProfile {
  id: string;
  name: string;
  condition: HealthCondition;
  dailyBudget: {
    sodiumMg: number;       // e.g. 2000mg WHO, 1500mg HT
    sugarG: number;         // e.g. 24g (6 tsp) WHO
    saturatedFatG: number;  // e.g. 15g WHO
    caloriesKcal: number;   // e.g. 2000 kcal
  };
  dailyConsumed: {
    sodiumMg: number;
    sugarG: number;
    saturatedFatG: number;
    caloriesKcal: number;
  };
}

export interface NutritionFacts {
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  transFatG: number;
  cholesterolMg: number;
  sodiumMg: number;
  totalCarbG: number;
  dietaryFiberG: number;
  sugarG: number;
  proteinG: number;
  potassiumMg?: number;
}

export interface FoodProduct {
  id: string;
  barcode: string;
  name: string;
  nameEn: string;
  brand: string;
  category: 'instant_noodles' | 'condiments' | 'beverages' | 'ready_meals' | 'snacks' | 'dairy';
  categoryLabel: string;
  imageUrl: string;
  nutrition: NutritionFacts;
  healthierChoiceCertified: boolean; // มีตรา "ทางเลือกสุขภาพ" อย.
  healthierChoiceSubcategory?: string;
  reductionClaim?: string; // e.g. "ลดโซเดียม 40%" หรือ "ไม่เติมน้ำตาลทราย"
  traceabilityLotCode: string; // FSMA 204 TLC
  mfgDate: string;
  expDate: string;
  manufacturer: string;
  originCountry: string;
  ingredients: string[];
  allergens: string[];
  smartSwapId?: string; // ID ของสินค้าทางเลือกที่ดีกว่า
  warningTags: string[];
}

export interface PantryItem {
  id: string;
  productId: string;
  product: FoodProduct;
  purchasedDate: string;
  lotCode: string;
  expiryDate: string;
  quantity: number;
  recallStatus: 'safe' | 'monitoring' | 'recalled';
  activeRecallId?: string;
  confirmedHandled?: boolean;
}

export interface RecallNotice {
  id: string;
  productId: string;
  productName: string;
  affectedLotCodes: string[];
  recallLevel: 'Class I' | 'Class II' | 'Class III';
  hazardDescription: string;
  hazardReason: 'microbial' | 'chemical' | 'physical' | 'undeclared_allergen';
  publishedDate: string;
  authorizingAgency: 'สำนักงานคณะกรรมการอาหารและยา (อย.)' | 'US FDA' | 'INFOSAN / RASFF';
  actionRequired: string;
  resolutionRatePercent: number; // e.g. 84%
  affectedConsumersCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  productContext?: Partial<FoodProduct>;
}
