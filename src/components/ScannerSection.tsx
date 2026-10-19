'use client';

import React, { useState } from 'react';
import { FoodProduct, UserHealthProfile } from '../types';
import { calculateChoiceScore, ScoreBreakdown } from '../lib/scoreCalculator';
import {
  ScanBarcode,
  Search,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  Award,
  Sparkles,
  QrCode,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface ScannerSectionProps {
  products: FoodProduct[];
  selectedProduct: FoodProduct | null;
  onSelectProduct: (product: FoodProduct) => void;
  profile: UserHealthProfile;
  onAddToPantry: (product: FoodProduct) => void;
  onOpenSmartSwap: (targetSwapId: string) => void;
  onAskNongChoice: (product: FoodProduct) => void;
}

export const ScannerSection: React.FC<ScannerSectionProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  profile,
  onAddToPantry,
  onOpenSmartSwap,
  onAskNongChoice,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isScanningSim, setIsScanningSim] = useState(false);

  const activeProduct = selectedProduct || products[0];
  const scoreBreakdown: ScoreBreakdown = calculateChoiceScore(activeProduct, profile);

  const handleSimulateScan = (product: FoodProduct) => {
    setIsScanningSim(true);
    setTimeout(() => {
      onSelectProduct(product);
      setIsScanningSim(false);
    }, 450);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const match = products.find(
      (p) =>
        p.barcode.includes(barcodeInput.trim()) ||
        p.name.toLowerCase().includes(barcodeInput.toLowerCase()) ||
        p.brand.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    if (match) {
      onSelectProduct(match);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <section className="space-y-6">
      {/* Search & Quick Scanner Bar */}
      <div className="glass-panel p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20">
              <ScanBarcode className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg text-slate-900">
                สแกนบาร์โค้ด หรือถ่ายรูปฉลากโภชนาการ
              </h3>
              <p className="text-xs text-slate-500">
                วิเคราะห์ Choice Score เฉพาะบุคคลใน 5 วินาที พร้อมตรวจสอบย้อนกลับรหัสล็อต
              </p>
            </div>
          </div>

          {/* Barcode Search Form */}
          <form onSubmit={handleManualSearch} className="flex items-center gap-2 w-full md:w-96">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="กรอกรหัสบาร์โค้ด หรือชื่อสินค้า..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="glass-input pl-9 text-xs sm:text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <button type="submit" className="glass-button glass-button-primary text-xs whitespace-nowrap py-2 px-3">
              ค้นหา
            </button>
          </form>
        </div>

        {/* Quick Sample Selector Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-200/50">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-teal-600" />
              คลิกเพื่อจำลองการสแกนสินค้าตัวอย่าง (อย. & CDC 2023 Study):
            </span>
            <div className="flex gap-1 overflow-x-auto text-[11px]">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2 py-0.5 rounded-md ${filterCategory === 'all' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-200/50'}`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterCategory('instant_noodles')}
                className={`px-2 py-0.5 rounded-md ${filterCategory === 'instant_noodles' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-200/50'}`}
              >
                บะหมี่
              </button>
              <button
                onClick={() => setFilterCategory('condiments')}
                className={`px-2 py-0.5 rounded-md ${filterCategory === 'condiments' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-200/50'}`}
              >
                เครื่องปรุง
              </button>
              <button
                onClick={() => setFilterCategory('beverages')}
                className={`px-2 py-0.5 rounded-md ${filterCategory === 'beverages' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-200/50'}`}
              >
                เครื่องดื่ม
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {filteredProducts.map((p) => {
              const isSelected = activeProduct.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSimulateScan(p)}
                  className={`flex-shrink-0 flex items-center gap-2 p-2 rounded-xl text-left border transition ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-500 text-teal-950 font-semibold shadow-sm'
                      : 'bg-white/40 border-slate-200/60 hover:bg-white/70 text-slate-700'
                  }`}
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="max-w-[170px] truncate">
                    <div className="text-[11px] font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <span>{p.nutrition.sodiumMg} mg Na</span>
                      {p.healthierChoiceCertified && (
                        <span className="text-[9px] text-teal-800 font-bold">★ อย.</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Scanned Product Analysis View */}
      <div className={`transition-all duration-300 ${isScanningSim ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Visual & Packaging Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="glass-card overflow-hidden p-5 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-4 shadow-md border border-white/60">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                />
                {activeProduct.healthierChoiceCertified && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-teal-800 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                    <Award className="h-3 w-3" />
                    <span>ตราทางเลือกสุขภาพ (อย.)</span>
                  </div>
                )}
                {activeProduct.traceabilityLotCode.includes('RECALL') && (
                  <div className="absolute bottom-2 inset-x-2 bg-rose-600/90 text-white text-[10px] font-bold py-1 px-2 rounded-lg animate-pulse">
                    ⚠️ อยู่ในประกาศเรียกคืน อย.
                  </div>
                )}
              </div>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-1">
                {activeProduct.categoryLabel}
              </span>
              <h2 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                {activeProduct.name}
              </h2>
              <p className="text-xs text-slate-500 mb-3">{activeProduct.brand}</p>

              {/* Traceability Lot Code & Barcode */}
              <div className="w-full bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 text-left text-xs space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">บาร์โค้ด:</span>
                  <span className="font-mono font-bold text-slate-800">{activeProduct.barcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">รหัสล็อต (TLC):</span>
                  <span className="font-mono font-bold text-teal-800">{activeProduct.traceabilityLotCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">วันผลิต / หมดอายุ:</span>
                  <span className="text-slate-700">{activeProduct.mfgDate} / {activeProduct.expDate}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={() => onAddToPantry(activeProduct)}
                  className="glass-button flex-1 text-xs py-2 bg-white/80 hover:bg-white text-slate-800"
                >
                  <PlusCircle className="h-4 w-4 text-teal-600" />
                  <span>บันทึกลงคลัง (Lot Alert)</span>
                </button>
                <button
                  onClick={() => onAskNongChoice(activeProduct)}
                  className="glass-button flex-1 text-xs py-2 bg-teal-500/20 text-teal-900 hover:bg-teal-500/30"
                >
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span>ถามน้องช้อยส์</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Choice Score & Nutrition Breakdown (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Choice Score Dial Card */}
            <div className="glass-panel p-6 border-l-4" style={{ borderLeftColor: scoreBreakdown.color }}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {/* Circular Score Badge */}
                  <div
                    className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg flex-shrink-0"
                    style={{
                      background: `radial-gradient(circle, #ffffff 60%, ${scoreBreakdown.color}25 100%)`,
                      border: `3px solid ${scoreBreakdown.color}`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black tracking-tight" style={{ color: scoreBreakdown.color }}>
                        {scoreBreakdown.finalScore}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-500 -mt-1">
                        เกรด {scoreBreakdown.grade}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Personalized Choice Score
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: scoreBreakdown.color }}>
                        {scoreBreakdown.grade}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mt-0.5">
                      {scoreBreakdown.finalScore >= 70 ? 'เป็นตัวเลือกที่ดีสำหรับคุณ' : 'ควรระมัดระวังปริมาณ'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-md">
                      {scoreBreakdown.summaryThai} (เทียบกับโปรไฟล์: <span className="font-semibold text-slate-800">{profile.name}</span>)
                    </p>
                  </div>
                </div>

                {/* Smart Swap Recommendation Trigger */}
                {activeProduct.smartSwapId && (
                  <button
                    onClick={() => onOpenSmartSwap(activeProduct.smartSwapId!)}
                    className="glass-button glass-button-primary text-xs md:text-sm py-2.5 px-4 shadow-md w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>ดูทางเลือกที่ดีกว่า (Smart Swap)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Penalties & Bonuses Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-200/50">
                {scoreBreakdown.penalties.length > 0 && (
                  <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-200/40">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 mb-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                      ข้อควรระวังสำหรับโปรไฟล์ของคุณ:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {scoreBreakdown.penalties.map((pen, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-rose-600 font-bold">-{pen.points}</span>
                          <span>{pen.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {scoreBreakdown.bonuses.length > 0 && (
                  <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-200/40">
                    <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                      จุดเด่นด้านโภชนาการที่ได้รับ:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {scoreBreakdown.bonuses.map((bon, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-teal-700 font-bold">+{bon.points}</span>
                          <span>{bon.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Nutrition Fact Label (Thai FDA Style) */}
            <div className="glass-card p-5">
              <h4 className="font-extrabold text-sm md:text-base text-slate-900 mb-3 flex items-center justify-between">
                <span>ข้อมูลโภชนาการ (Nutrition Facts)</span>
                <span className="text-xs font-normal text-slate-500">
                  หนึ่งหน่วยบริโภค: {activeProduct.nutrition.servingSize}
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-medium">พลังงาน</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {activeProduct.nutrition.calories} <span className="text-xs font-normal">kcal</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${activeProduct.nutrition.sodiumMg > 1000 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                  <span className="text-[11px] text-slate-500 font-medium">โซเดียม (Sodium)</span>
                  <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.sodiumMg > 1000 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeProduct.nutrition.sodiumMg} <span className="text-xs font-normal">มก.</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {scoreBreakdown.budgetImpact.sodiumPercentOfDaily}% ของงบวัน
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${activeProduct.nutrition.sugarG > 15 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                  <span className="text-[11px] text-slate-500 font-medium">น้ำตาล (Sugar)</span>
                  <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.sugarG > 15 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeProduct.nutrition.sugarG} <span className="text-xs font-normal">กรัม</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {scoreBreakdown.budgetImpact.sugarPercentOfDaily}% ของงบวัน
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${activeProduct.nutrition.saturatedFatG > 5 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                  <span className="text-[11px] text-slate-500 font-medium">ไขมันอิ่มตัว</span>
                  <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.saturatedFatG > 5 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeProduct.nutrition.saturatedFatG} <span className="text-xs font-normal">กรัม</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {scoreBreakdown.budgetImpact.saturatedFatPercentOfDaily}% ของงบวัน
                  </div>
                </div>
              </div>

              {/* Key Ingredients & Food Safety Traceability */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">ส่วนประกอบสำคัญ:</span>{' '}
                  {activeProduct.ingredients.join(', ')}
                </div>
                {activeProduct.reductionClaim && (
                  <div className="text-teal-900 font-bold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60">
                    ✓ {activeProduct.reductionClaim}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
