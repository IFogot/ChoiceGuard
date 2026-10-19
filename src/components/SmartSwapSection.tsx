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
  const swapPairs = products
    .filter((p) => p.smartSwapId)
    .map((orig) => {
      const swapped = products.find((p) => p.id === orig.smartSwapId);
      return { original: orig, swapped: swapped! };
    })
    .filter((pair) => Boolean(pair.swapped));

  const [selectedPairIndex, setSelectedPairIndex] = useState(() => {
    if (initialTargetSwapId) {
      const idx = swapPairs.findIndex((pair) => pair.swapped.id === initialTargetSwapId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const activePair = swapPairs[selectedPairIndex] || swapPairs[0];
  const origScore = calculateChoiceScore(activePair.original, profile);
  const swapScore = calculateChoiceScore(activePair.swapped, profile);

  // Nutritional deltas
  const sodiumSaved = activePair.original.nutrition.sodiumMg - activePair.swapped.nutrition.sodiumMg;
  const sodiumSavedPercent = Math.round((sodiumSaved / activePair.original.nutrition.sodiumMg) * 100);

  const sugarSaved = activePair.original.nutrition.sugarG - activePair.swapped.nutrition.sugarG;
  const sugarSavedPercent = activePair.original.nutrition.sugarG > 0
    ? Math.round((sugarSaved / activePair.original.nutrition.sugarG) * 100)
    : 0;

  const satFatSaved = activePair.original.nutrition.saturatedFatG - activePair.swapped.nutrition.saturatedFatG;
  const satFatSavedPercent = activePair.original.nutrition.saturatedFatG > 0
    ? Math.round((satFatSaved / activePair.original.nutrition.saturatedFatG) * 100)
    : 0;

  const handleApply = () => {
    onApplySwapToConsumed(activePair.original, activePair.swapped);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 2500);
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg md:text-xl text-slate-900">
                  Smart Swap: ทางเลือกที่ดีกว่าทันที
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  ตราทางเลือกสุขภาพ อย.
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                เปรียบเทียบและสลับสินค้าในชีวิตประจำวันเพื่อลดโซเดียมและน้ำตาลโดยไม่ต้องอดอาหาร
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50/80 px-4 py-2 rounded-xl border border-emerald-200/60">
            <TrendingDown className="h-5 w-5 text-emerald-600" />
            <div className="text-left">
              <div className="text-[11px] text-emerald-800 font-semibold">เป้าหมายลดโซเดียมต่อมื้อ</div>
              <div className="text-sm font-extrabold text-emerald-950">-20% ถึง -55%</div>
            </div>
          </div>
        </div>

        {/* Pair Tabs */}
        <div className="flex gap-2 overflow-x-auto mt-5 pt-4 border-t border-slate-200/60 pb-1">
          {swapPairs.map((pair, idx) => (
            <button
              key={pair.original.id}
              onClick={() => setSelectedPairIndex(idx)}
              className={`flex-shrink-0 flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold border transition ${
                selectedPairIndex === idx
                  ? 'bg-teal-700 text-white border-teal-800 shadow-md'
                  : 'bg-white/60 hover:bg-white text-slate-700 border-slate-200/70'
              }`}
            >
              <span>{pair.original.categoryLabel}:</span>
              <span className="font-normal opacity-90 truncate max-w-[130px]">{pair.swapped.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-stretch">
        {/* Left: Original Product Card (5 cols) */}
        <div className="md:col-span-5 glass-card p-5 border border-slate-300/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                สินค้าดั้งเดิมที่ซื้อทั่วไป
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                Score {origScore.finalScore} (เกรด {origScore.grade})
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={activePair.original.imageUrl}
                alt={activePair.original.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
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
            </div>
          </div>

          <div className="mt-4 pt-3 text-[11px] text-slate-500 border-t border-slate-200/50">
            รหัสล็อตสินค้า: <span className="font-mono text-slate-700">{activePair.original.traceabilityLotCode}</span>
          </div>
        </div>

        {/* Center: Transform Arrow & Net Savings Badge (1 col) */}
        <div className="md:col-span-1 flex flex-row md:flex-col items-center justify-center gap-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-md">
            <ArrowRight className="h-5 w-5 hidden md:block" />
            <TrendingDown className="h-5 w-5 md:hidden" />
          </div>
          <span className="text-[11px] font-extrabold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
            ประหยัด
          </span>
        </div>

        {/* Right: Smart Swap Certified Alternative Card (5 cols) */}
        <div className="md:col-span-5 glass-card p-5 border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/40 via-white/80 to-teal-50/40 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                สูตรทางเลือกสุขภาพ (อย. รับรอง)
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                Score {swapScore.finalScore} (เกรด {swapScore.grade})
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={activePair.swapped.imageUrl}
                alt={activePair.swapped.name}
                className="w-16 h-16 rounded-xl object-cover border border-emerald-300 shadow-sm"
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
            <div className="space-y-2.5 bg-white/80 p-3.5 rounded-xl border border-emerald-200 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">โซเดียมต่อหน่วยบริโภค:</span>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {activePair.swapped.nutrition.sodiumMg.toLocaleString()} มก.
                  </span>
                  {sodiumSaved > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded">
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
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between border-t border-emerald-200/60">
            <div className="text-[11px] text-slate-500">
              รหัสล็อต: <span className="font-mono text-teal-800 font-bold">{activePair.swapped.traceabilityLotCode}</span>
            </div>
            <button
              onClick={handleApply}
              className={`glass-button text-xs py-2 px-3.5 font-bold transition flex items-center gap-1.5 ${
                appliedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'glass-button-primary'
              }`}
            >
              {appliedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>สลับสำเร็จ! ปรับลดงบวันนี้แล้ว</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="h-3.5 w-3.5" />
                  <span>สลับเป็นสูตรนี้ (ปรับงบรายวัน)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
