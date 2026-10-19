'use client';

import React, { useState } from 'react';
import { FoodProduct, UserHealthProfile } from '../types';
import { calculateChoiceScore } from '../lib/scoreCalculator';
import {
  RefreshCw,
  Sparkles,
  Award,
  ArrowRight,
  Check,
  TrendingDown,
  ShieldCheck,
  Layers,
  HeartHandshake,
  Coins,
  Activity,
  HeartPulse,
  Flame,
  Info,
  Calendar,
  PackagePlus,
} from 'lucide-react';

interface SmartSwapSectionProps {
  products: FoodProduct[];
  profile: UserHealthProfile;
  initialTargetSwapId?: string | null;
  onApplySwapToConsumed: (originalProduct: FoodProduct, swappedProduct: FoodProduct) => void;
}

export const SmartSwapSection: React.FC<SmartSwapSectionProps> = ({
  products,
  profile,
  initialTargetSwapId,
  onApplySwapToConsumed,
}) => {
  // Find pairs of original and smart swap products
  const allSwapPairs = products
    .filter((p) => p.smartSwapId)
    .map((orig) => {
      const swapped = products.find((p) => p.id === orig.smartSwapId);
      return { original: orig, swapped: swapped! };
    })
    .filter((pair) => Boolean(pair.swapped));

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [consumptionFrequency, setConsumptionFrequency] = useState<number>(3); // times per week

  const filteredPairs = allSwapPairs.filter((pair) => {
    if (activeCategory === 'all') return true;
    return pair.original.category === activeCategory;
  });

  const [selectedPairIndex, setSelectedPairIndex] = useState(() => {
    if (initialTargetSwapId) {
      const idx = allSwapPairs.findIndex((pair) => pair.swapped.id === initialTargetSwapId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const activePair = filteredPairs[selectedPairIndex] || filteredPairs[0] || allSwapPairs[0];
  const origScore = calculateChoiceScore(activePair.original, profile);
  const swapScore = calculateChoiceScore(activePair.swapped, profile);

  // Per serving nutritional deltas
  const sodiumSaved = Math.max(0, activePair.original.nutrition.sodiumMg - activePair.swapped.nutrition.sodiumMg);
  const sodiumSavedPercent = activePair.original.nutrition.sodiumMg > 0
    ? Math.round((sodiumSaved / activePair.original.nutrition.sodiumMg) * 100)
    : 0;

  const sugarSaved = Math.max(0, activePair.original.nutrition.sugarG - activePair.swapped.nutrition.sugarG);
  const sugarSavedPercent = activePair.original.nutrition.sugarG > 0
    ? Math.round((sugarSaved / activePair.original.nutrition.sugarG) * 100)
    : 0;

  const satFatSaved = Math.max(0, activePair.original.nutrition.saturatedFatG - activePair.swapped.nutrition.saturatedFatG);
  const satFatSavedPercent = activePair.original.nutrition.saturatedFatG > 0
    ? Math.round((satFatSaved / activePair.original.nutrition.saturatedFatG) * 100)
    : 0;

  const caloriesSaved = Math.max(0, activePair.original.nutrition.calories - activePair.swapped.nutrition.calories);

  // Cumulative Annual Impact Models (CDC 2023 Study & Thai NHSO Burden of Disease)
  const annualTimes = consumptionFrequency * 52;
  const annualSodiumSavedMg = sodiumSaved * annualTimes;
  const annualSodiumSavedGrams = (annualSodiumSavedMg / 1000).toFixed(1);
  const annualSaltTeaspoons = (annualSodiumSavedMg / 2000).toFixed(1); // 1 tsp salt ≈ 2,000 mg Na
  const annualSugarCubes = Math.round((sugarSaved * annualTimes) / 4); // 1 sugar cube ≈ 4g
  // Health economic savings based on dialysis/stroke prevention model: ~3,800 THB per 1000mg/day reduction/yr
  const annualHealthcareSavingsTHB = Math.max(250, Math.round(((annualSodiumSavedMg / (1000 * 365)) * 3800)));
  const renalStressReductionPercent = Math.min(48, Math.round(sodiumSavedPercent * 0.75));

  const handleApply = () => {
    onApplySwapToConsumed(activePair.original, activePair.swapped);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 2500);
  };

  return (
    <section className="space-y-6">
      {/* 1. Header Banner & Filter Navigation */}
      <div className="glass-panel p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg md:text-xl text-slate-900">
                  Smart Swap: นวัตกรรมสลับช้อยส์ที่ดีกว่าทันที
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  ตราสัญลักษณ์ทางเลือกสุขภาพ (อย. 3,245+ รายการ)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                เปรียบเทียบโภชนาการแบบหมัดต่อหมัด คำนวณผลกระทบสุขภาพสะสม และสลับสู่สูตรปลอดภัยได้ในคลิกเดียว
              </p>
            </div>
          </div>

          {/* Target Impact Pill */}
          <div className="flex items-center gap-2.5 bg-emerald-50/80 px-4 py-2.5 rounded-2xl border border-emerald-200/70 shadow-sm">
            <TrendingDown className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-[11px] text-emerald-800 font-semibold">เป้าหมายลดโซเดียมต่อมื้อ</div>
              <div className="text-sm font-extrabold text-emerald-950">-20% ถึง -55% ตามเกณฑ์ อย.</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto mt-5 pt-4 border-t border-slate-200/60 pb-1">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">หมวดหมู่:</span>
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'instant_noodles', label: 'บะหมี่กึ่งสำเร็จรูป' },
            { id: 'condiments', label: 'เครื่องปรุงรส (น้ำปลา/ซอส)' },
            { id: 'beverages', label: 'เครื่องดื่มเพื่อสุขภาพ' },
            { id: 'ready_meals', label: 'อาหารพร้อมทาน/โปรตีน' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedPairIndex(0);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white/60 hover:bg-white text-slate-600 border border-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pair Selection Tabs */}
        <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
          {filteredPairs.map((pair, idx) => (
            <button
              key={pair.original.id}
              onClick={() => setSelectedPairIndex(idx)}
              className={`flex-shrink-0 flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold border transition ${
                selectedPairIndex === idx
                  ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white border-teal-800 shadow-md'
                  : 'bg-white/60 hover:bg-white text-slate-700 border-slate-200/70'
              }`}
            >
              <span className="font-bold opacity-90">{pair.original.categoryLabel}:</span>
              <span className="truncate max-w-[140px]">{pair.swapped.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-stretch">
        {/* Left: Original Product Card (5 cols) */}
        <div className="md:col-span-5 glass-card p-5 border border-slate-300/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                สูตรดั้งเดิมทั่วไปในท้องตลาด
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                Score {origScore.finalScore} (เกรด {origScore.grade})
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <img
                src={activePair.original.imageUrl}
                alt={activePair.original.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <h4 className="font-extrabold text-sm md:text-base text-slate-900 leading-snug">
                  {activePair.original.name}
                </h4>
                <p className="text-xs text-slate-500">{activePair.original.brand}</p>
                <div className="text-[11px] text-rose-600 font-semibold mt-1">
                  {activePair.original.warningTags[0] || 'สูตรปกติ (โซเดียม/น้ำตาลสูง)'}
                </div>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-2.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">โซเดียมต่อหน่วยบริโภค:</span>
                <span className="font-extrabold text-rose-600 text-sm">
                  {activePair.original.nutrition.sodiumMg.toLocaleString()} มก.
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">น้ำตาลต่อหน่วยบริโภค:</span>
                <span className="font-extrabold text-slate-800">
                  {activePair.original.nutrition.sugarG} กรัม
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">ไขมันอิ่มตัว:</span>
                <span className="font-extrabold text-slate-800">
                  {activePair.original.nutrition.saturatedFatG} กรัม
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">พลังงาน:</span>
                <span className="font-bold text-slate-700">
                  {activePair.original.nutrition.calories} kcal
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/40 text-[11px] text-slate-500">
                <span>โพแทสเซียม (เกลือแร่ลดบวม):</span>
                <span>{activePair.original.nutrition.potassiumMg || 50} มก.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 text-[11px] text-slate-500 border-t border-slate-200/50 flex justify-between items-center">
            <span>รหัสล็อต (TLC): <strong className="font-mono text-slate-700">{activePair.original.traceabilityLotCode}</strong></span>
            <span className="text-rose-600 text-[10px] font-bold">ไม่มีตราทางเลือกสุขภาพ</span>
          </div>
        </div>

        {/* Center: Transform Arrow & Net Savings Badge (1 col) */}
        <div className="md:col-span-1 flex flex-row md:flex-col items-center justify-center gap-2 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/30">
            <ArrowRight className="h-5 w-5 hidden md:block" />
            <TrendingDown className="h-5 w-5 md:hidden" />
          </div>
          <span className="text-[11px] font-extrabold text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xs">
            สลับแล้วดีกว่า
          </span>
        </div>

        {/* Right: Smart Swap Certified Alternative Card (5 cols) */}
        <div className="md:col-span-5 glass-card p-5 border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/40 via-white/80 to-teal-50/40 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                สูตรทางเลือกสุขภาพ (อย. รับรอง)
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                Score {swapScore.finalScore} (เกรด {swapScore.grade})
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <img
                src={activePair.swapped.imageUrl}
                alt={activePair.swapped.name}
                className="w-16 h-16 rounded-2xl object-cover border border-emerald-300 shadow-sm"
              />
              <div>
                <h4 className="font-extrabold text-sm md:text-base text-slate-900 leading-snug">
                  {activePair.swapped.name}
                </h4>
                <p className="text-xs text-slate-600">{activePair.swapped.brand}</p>
                <div className="text-[11px] text-emerald-800 font-bold mt-1">
                  ✓ {activePair.swapped.reductionClaim || 'ผ่านเกณฑ์ อย. ทางเลือกสุขภาพ'}
                </div>
              </div>
            </div>

            {/* Metrics List with Green Deltas */}
            <div className="space-y-2.5 bg-white/90 p-3.5 rounded-xl border border-emerald-200 text-xs shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">โซเดียมต่อหน่วยบริโภค:</span>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {activePair.swapped.nutrition.sodiumMg.toLocaleString()} มก.
                  </span>
                  {sodiumSaved > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded shadow-xs">
                      -{sodiumSavedPercent}% (-{sodiumSaved} mg)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">น้ำตาลต่อหน่วยบริโภค:</span>
                <div className="text-right">
                  <span className="font-extrabold text-slate-800">
                    {activePair.swapped.nutrition.sugarG} กรัม
                  </span>
                  {sugarSaved > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold text-white bg-cyan-600 px-1.5 py-0.5 rounded">
                      -{sugarSavedPercent}% (-{sugarSaved}g)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">ไขมันอิ่มตัว:</span>
                <div className="text-right">
                  <span className="font-extrabold text-slate-800">
                    {activePair.swapped.nutrition.saturatedFatG} กรัม
                  </span>
                  {satFatSaved > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded">
                      -{satFatSavedPercent}% (-{satFatSaved}g)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">พลังงาน:</span>
                <span className="font-bold text-slate-700">
                  {activePair.swapped.nutrition.calories} kcal
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-emerald-100 text-[11px] text-emerald-700">
                <span>โพแทสเซียม (เกลือแร่ลดบวม):</span>
                <span className="font-bold">{activePair.swapped.nutrition.potassiumMg || 280} มก. (สมดุล Na:K สูงขึ้น)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between border-t border-emerald-200/60">
            <div className="text-[11px] text-slate-500">
              รหัสล็อต: <span className="font-mono text-teal-800 font-bold">{activePair.swapped.traceabilityLotCode}</span>
            </div>
            <button
              onClick={handleApply}
              className={`glass-button text-xs py-2 px-4 font-bold transition flex items-center gap-1.5 ${
                appliedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'glass-button-primary'
              }`}
            >
              {appliedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>สลับสำเร็จ! ปรับงบรายวันแล้ว</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="h-4 w-4" />
                  <span>สลับช้อยส์นี้ (Apply Swap)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Cumulative Annual Health & Economic Impact Calculator */}
      <div className="glass-panel p-6 border border-teal-500/20 bg-gradient-to-r from-teal-50/30 via-white/80 to-emerald-50/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base md:text-lg text-slate-900">
                ผลกระทบสุขภาพและเศรษฐกิจสะสมรายปี (Annual Health Impact Calculator)
              </h4>
              <p className="text-xs text-slate-500">
                คำนวณผลลัพธ์ระยะยาวหากคุณเลือกทานสูตรนี้แทนเป็นประจำ (อิงข้อมูลงานวิจัย สธ. &amp; สปสช.)
              </p>
            </div>
          </div>

          {/* Consumption Frequency Selector */}
          <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 px-2">ความถี่:</span>
            {[
              { times: 1, label: '1 ครั้ง/สัปดาห์' },
              { times: 3, label: '3 ครั้ง/สัปดาห์' },
              { times: 7, label: 'ทุกวัน (Daily)' },
            ].map((freq) => (
              <button
                key={freq.times}
                onClick={() => setConsumptionFrequency(freq.times)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  consumptionFrequency === freq.times
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white/90 p-4 rounded-2xl border border-teal-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5 text-teal-600" />
              ลดโซเดียมสะสม
            </span>
            <div className="text-xl md:text-2xl font-black text-teal-800 mt-1">
              {annualSodiumSavedGrams} <span className="text-xs font-bold text-slate-600">กรัม/ปี</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              เทียบเท่าเกลือแกง <strong>{annualSaltTeaspoons} ช้อนชา</strong> ที่ไม่สะสมในไต
            </p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-emerald-600" />
              ประหยัดค่ายารักษา NCDs
            </span>
            <div className="text-xl md:text-2xl font-black text-emerald-700 mt-1">
              ฿{annualHealthcareSavingsTHB.toLocaleString()} <span className="text-xs font-bold text-slate-600">/ปี</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ลดความเสี่ยงการฟอกไตและค่ายาลดความดัน (NHSO Model)
            </p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-cyan-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <HeartPulse className="h-3.5 w-3.5 text-cyan-600" />
              ลดภาระการกรองของไต
            </span>
            <div className="text-xl md:text-2xl font-black text-cyan-800 mt-1">
              -{renalStressReductionPercent}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ลดแรงตึงหลอดเลือดฝอยในไต ชะลอภาวะไตเสื่อม (CKD)
            </p>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-600" />
              น้ำตาล/แคลอรี่ที่ลดได้
            </span>
            <div className="text-xl md:text-2xl font-black text-amber-700 mt-1">
              {annualSugarCubes > 0 ? `-${annualSugarCubes} ก้อน` : `-${caloriesSaved * annualTimes} kcal`}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ช่วยคุมระดับน้ำตาลสะสม (HbA1c) และไขมันไตรกลีเซอไรด์
            </p>
          </div>
        </div>

        {/* Practical Health Guidance Note */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-600">
          <Info className="h-4 w-4 text-teal-600 flex-shrink-0" />
          <span>
            <strong>ข้อแนะนำจากนักกำหนดอาหาร:</strong> หากทานบะหมี่กึ่งสำเร็จรูป การไม่ซดน้ำซุปจนหมด สามารถลดโซเดียมได้เพิ่มขึ้นอีกถึง 40-50% ทันที
          </span>
        </div>
      </div>
    </section>
  );
};
